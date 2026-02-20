'use client';

import { useState, useEffect } from 'react';
import { useGoal } from '../../../context/GoalContext';
import { useUser } from '../../../context/UserContext';
import { getDailyNeeds } from '../../../utils/calculateMetrics';
import dayjs from 'dayjs';
import { Utensils, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from './Card';
import { addMeal, getMeals, deleteMeal } from '@/lib/firestore';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fiber: number;
  date: string;
}

export default function MealTracker() {
  const { goal } = useGoal();
  const { user } = useUser();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fiber, setFiber] = useState('');
  const [showForm, setShowForm] = useState(false);

  const today = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    if (!user) return;

    const loadMeals = async () => {
      try {
        const data = await getMeals(user.uid);
        const mapped = data.map((m: any) => ({
          id: m.id,
          name: m.name,
          calories: m.calories,
          protein: m.protein,
          fiber: m.fiber,
          date: m.date,
        }));
        setMeals(mapped);
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    };

    loadMeals();
  }, [user]);

  // Filter meals for today only
  const todayMeals = meals.filter((m) => (m.date || today) === today);

  const todayTotal = todayMeals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      fiber: acc.fiber + m.fiber,
    }),
    { calories: 0, protein: 0, fiber: 0 }
  );

  const needs = getDailyNeeds(goal);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newMeal = {
      name: name.trim(),
      calories: Number(calories),
      protein: Number(protein),
      fiber: Number(fiber),
      date: today,
    };

    try {
      const id = await addMeal(user.uid, newMeal);
      setMeals((prev) => [...prev, { id, ...newMeal }]);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
    setName('');
    setCalories('');
    setProtein('');
    setFiber('');
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteMeal(user.uid, id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const calPercent = needs.dailyCalories > 0 ? Math.min((todayTotal.calories / needs.dailyCalories) * 100, 100) : 0;
  const protPercent = needs.proteinGrams > 0 ? Math.min((todayTotal.protein / needs.proteinGrams) * 100, 100) : 0;
  const overCalories = goal && todayTotal.calories > needs.dailyCalories;
  const underProtein = goal && todayTotal.protein < needs.proteinGrams;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Utensils className="w-5 h-5 text-green-500" />
          Today&apos;s Meals
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Progress bars */}
      {goal && (
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Calories</span>
              <span className={overCalories ? 'text-red-400' : 'text-muted/70'}>
                {todayTotal.calories} / {needs.dailyCalories} kcal
              </span>
            </div>
            <div className="w-full h-2 bg-white\/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${overCalories ? 'bg-red-500' : 'bg-accent'}`}
                style={{ width: `${calPercent}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted">Protein</span>
              <span className="text-muted/70">{todayTotal.protein} / {needs.proteinGrams}g</span>
            </div>
            <div className="w-full h-2 bg-white\/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${protPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddMeal} className="space-y-3 mb-4 pb-4 border-b border-white/5">
          <input
            type="text"
            placeholder="Meal name (e.g., Chicken breast)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm"
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <input type="number" placeholder="Calories" value={calories} onChange={(e) => setCalories(e.target.value)} className="px-3 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm" required min="1" />
            <input type="number" placeholder="Protein (g)" value={protein} onChange={(e) => setProtein(e.target.value)} className="px-3 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm" required min="0" />
            <input type="number" placeholder="Fiber (g)" value={fiber} onChange={(e) => setFiber(e.target.value)} className="px-3 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm" required min="0" />
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium text-sm transition">
            Log Meal
          </button>
        </form>
      )}

      {/* Meal list */}
      {todayMeals.length === 0 ? (
        <p className="text-muted/70 text-sm text-center py-4">No meals logged today.</p>
      ) : (
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {todayMeals.map((m) => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm shadow-inner rounded-lg group">
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-muted/70">{m.calories} kcal &middot; {m.protein}g protein &middot; {m.fiber}g fiber</p>
              </div>
              <button onClick={() => handleDelete(m.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status */}
      {goal && todayMeals.length > 0 && (
        <div className="mt-4 space-y-1.5 text-sm">
          {overCalories && (
            <p className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" /> Over calorie target by {todayTotal.calories - needs.dailyCalories} kcal
            </p>
          )}
          {underProtein && (
            <p className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" /> {needs.proteinGrams - todayTotal.protein}g more protein needed
            </p>
          )}
          {!overCalories && !underProtein && (
            <p className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" /> On track with nutrition goals
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
