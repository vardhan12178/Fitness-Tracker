'use client';

import { useEffect, useState } from 'react';
import { useGoal } from '../../../context/GoalContext';
import { useUser } from '../../../context/UserContext';
import { getDailyNeeds } from '../../../utils/calculateMetrics';
import dayjs from 'dayjs';
import Card from './Card';
import { BarChart3, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { getMeals, getSleepLogs } from '@/lib/firestore';

export default function SmartSummary() {
  const { goal } = useGoal();
  const { user } = useUser();
  const [avgSleep, setAvgSleep] = useState(0);
  const [avgProtein, setAvgProtein] = useState(0);
  const [avgCalories, setAvgCalories] = useState(0);
  const [daysWithMealData, setDaysWithMealData] = useState(0);
  const [daysWithSleepData, setDaysWithSleepData] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadSummary = async () => {
      try {
        const [meals, sleep] = await Promise.all([
          getMeals(user.uid),
          getSleepLogs(user.uid),
        ]);

    const last7Days = Array.from({ length: 7 }).map((_, i) =>
      dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    );

        // Group meals by date
        const grouped: Record<string, { calories: number; protein: number }> = {};
        meals.forEach((m: any) => {
          const date = m.date || dayjs().format('YYYY-MM-DD');
          if (!last7Days.includes(date)) return;
          if (!grouped[date]) grouped[date] = { calories: 0, protein: 0 };
          grouped[date].calories += m.calories;
          grouped[date].protein += m.protein;
        });

        const mealDays = Object.keys(grouped).length;
        const last7Sleep = sleep.filter((s: any) => last7Days.includes(s.date));

        // Divide by actual days with data, not always 7
        const avgCal = mealDays > 0
          ? Object.values(grouped).reduce((acc, d) => acc + d.calories, 0) / mealDays
          : 0;
        const avgProt = mealDays > 0
          ? Object.values(grouped).reduce((acc, d) => acc + d.protein, 0) / mealDays
          : 0;
        const avgSlp = last7Sleep.length > 0
          ? last7Sleep.reduce((acc: number, s: any) => acc + s.hours, 0) / last7Sleep.length
          : 0;

        setAvgCalories(Math.round(avgCal));
        setAvgProtein(Math.round(avgProt));
        setAvgSleep(Number(avgSlp.toFixed(1)));
        setDaysWithMealData(mealDays);
        setDaysWithSleepData(last7Sleep.length);
      } catch (error) {
        console.error('Error loading summary:', error);
      }
    };

    loadSummary();
  }, [user]);

  const needs = getDailyNeeds(goal);
  const hasGoal = !!goal;
  const hasData = daysWithMealData > 0 || daysWithSleepData > 0;

  if (!hasData) {
    return (
      <Card>
        <div className="flex items-center gap-3 text-gray-400">
          <BarChart3 className="w-5 h-5" />
          <p className="text-sm">Start logging meals and sleep to see your weekly summary.</p>
        </div>
      </Card>
    );
  }

  const overCalories = hasGoal && avgCalories > needs.dailyCalories;
  const lowProtein = hasGoal && avgProtein < needs.proteinGrams;
  const lowSleep = avgSleep > 0 && avgSleep < 7;
  const allGood = hasGoal && !overCalories && !lowProtein && !lowSleep;

  return (
    <Card>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-orange-500" />
        7-Day Summary
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#030712] rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Avg Calories</p>
          <p className="text-lg font-bold">{avgCalories}</p>
          {hasGoal && <p className="text-xs text-gray-600">/ {needs.dailyCalories} kcal</p>}
          {daysWithMealData > 0 && <p className="text-[10px] text-gray-600 mt-0.5">{daysWithMealData}d data</p>}
        </div>
        <div className="bg-[#030712] rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Avg Protein</p>
          <p className="text-lg font-bold">{avgProtein}<span className="text-xs text-gray-500 font-normal">g</span></p>
          {hasGoal && <p className="text-xs text-gray-600">/ {needs.proteinGrams}g</p>}
        </div>
        <div className="bg-[#030712] rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Avg Sleep</p>
          <p className="text-lg font-bold">{avgSleep}<span className="text-xs text-gray-500 font-normal"> hrs</span></p>
          {daysWithSleepData > 0 && <p className="text-[10px] text-gray-600 mt-0.5">{daysWithSleepData}d data</p>}
        </div>
      </div>

      <div className="space-y-1.5 text-sm">
        {overCalories && (
          <p className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" /> Averaging {avgCalories - needs.dailyCalories} kcal over target
          </p>
        )}
        {lowProtein && (
          <p className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4 shrink-0" /> Protein intake {needs.proteinGrams - avgProtein}g below goal
          </p>
        )}
        {lowSleep && (
          <p className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4 shrink-0" /> Sleep averaging below 7 hours
          </p>
        )}
        {allGood && (
          <p className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4 shrink-0" /> All weekly averages are on track
          </p>
        )}
      </div>
    </Card>
  );
}
