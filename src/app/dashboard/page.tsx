'use client';

import { useUser } from '../../../context/UserContext';
import { useGoal } from '../../../context/GoalContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { calculateMetrics, formatGoalType, getDailyNeeds } from '../../../utils/calculateMetrics';
import {
  addWorkout,
  getWorkouts,
  deleteWorkout,
  getStepsLogs,
  getMeals,
  getSleepLogs,
  addMeal,
  upsertSleepLogByDate,
  upsertStepsLogByDate,
  deleteMealsByDate,
  deleteWorkoutsByDate,
} from '@/lib/firestore';

import SmartSummary from '../components/SmartSummary';
import MealTracker from '../components/MealTracker';
import SleepTracker from '../components/SleepTracker';
import DailyStatusCalendar from '../components/DailyStatusCalendar';
import Card from '../components/Card';
import DailyCheckInModal from '../components/DailyCheckInModal';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

import { Dumbbell, Trash2, Plus, Footprints, Target, TrendingUp, Flame, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Workout {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
  workoutType?: 'bodyweight' | 'weighted';
  workoutIntensity?: 'easy' | 'medium' | 'hard';
}

interface MealLog {
  id: string;
  date: string;
  calories: number;
  protein: number;
  fiber: number;
  mealMode?: 'quick-light' | 'quick-balanced' | 'quick-heavy' | 'exact';
}

interface SleepLog {
  id: string;
  date: string;
  hours: number;
}

interface StepsLog {
  id: string;
  date: string;
  count?: number;
  goal?: number;
  createdAt?: any;
}

const COLORS = ['#f97316', '#14b8a6', '#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9'];

export default function DashboardPage() {
  const { user, isLoading: userLoading } = useUser();
  const { goal, isLoading: goalLoading } = useGoal();
  const router = useRouter();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [stepsLogs, setStepsLogs] = useState<StepsLog[]>([]);
  const [viewTab, setViewTab] = useState<'today' | 'yesterday' | 'week'>('today');
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [isSavingCheckIn, setIsSavingCheckIn] = useState(false);

  // Step tracker state
  const [stepGoal, setStepGoal] = useState(8000);
  const [stepsTaken, setStepsTaken] = useState(0);
  const [stepsInput, setStepsInput] = useState('');

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (!user) return;

    const loadAllData = async () => {
      try {
        const [workoutData, mealData, sleepData, stepsData] = await Promise.all([
          getWorkouts(user.uid),
          getMeals(user.uid),
          getSleepLogs(user.uid),
          getStepsLogs(user.uid),
        ]);

        const mappedWorkouts = workoutData.map((w: any) => ({
          id: w.id,
          exercise: w.exercise,
          sets: w.sets,
          reps: w.reps,
          weight: w.weight,
          date: w.date,
          workoutType: w.workoutType,
          workoutIntensity: w.workoutIntensity,
        }));
        setWorkouts(mappedWorkouts);

        const mappedMeals = mealData.map((m: any) => ({
          id: m.id,
          date: m.date,
          calories: m.calories,
          protein: m.protein,
          fiber: m.fiber,
          mealMode: m.mealMode,
        }));
        setMeals(mappedMeals);

        const mappedSleep = sleepData.map((s: any) => ({
          id: s.id,
          date: s.date,
          hours: s.hours,
        }));
        setSleepLogs(mappedSleep);

        const mappedSteps = stepsData as StepsLog[];
        setStepsLogs(mappedSteps);

        const today = dayjs().format('YYYY-MM-DD');
        const todayLogs = mappedSteps.filter((l) => l.date === today);
        if (todayLogs.length > 0) {
          const latest = [...todayLogs].sort((a, b) => {
            const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return bTime - aTime;
          })[0];
          setStepsTaken(latest.count || 0);
          setStepGoal(latest.goal || 8000);
        } else {
          setStepsTaken(0);
          setStepGoal(8000);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadAllData();
  }, [user]);

  const saveSteps = async (steps: number, goal: number) => {
    if (!user) return;
    const today = dayjs().format('YYYY-MM-DD');
    try {
      await upsertStepsLogByDate(user.uid, today, steps, goal);
      setStepsLogs((prev) => [{ id: `temp-${today}`, date: today, count: steps, goal }, ...prev.filter((p) => p.date !== today)]);
    } catch (error) {
      console.error('Error saving steps:', error);
    }
  };

  const handleAddSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSteps = stepsTaken + Number(stepsInput);
    setStepsTaken(newSteps);
    await saveSteps(newSteps, stepGoal);
    setStepsInput('');
  };

  const handleAddWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newWorkout = {
      exercise: exercise.trim(),
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      date: dayjs().format('YYYY-MM-DD'),
    };

    try {
      const id = await addWorkout(user.uid, newWorkout);
      setWorkouts((prev) => [...prev, { id, ...newWorkout }]);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
    setExercise('');
    setSets('');
    setReps('');
    setWeight('');
    setShowWorkoutForm(false);
  };

  const getCheckInDate = () => {
    if (viewTab === 'yesterday') return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    return dayjs().format('YYYY-MM-DD');
  };

  const getInitialCheckInData = (date: string) => {
    const dateMeals = meals.filter((m) => m.date === date);
    const mealTotals = dateMeals.reduce(
      (acc, curr) => ({
        calories: acc.calories + curr.calories,
        protein: acc.protein + curr.protein,
        fiber: acc.fiber + curr.fiber,
      }),
      { calories: 0, protein: 0, fiber: 0 }
    );
    const sleep = sleepLogs.find((s) => s.date === date);
    const dateSteps = stepsLogs.filter((s) => s.date === date);
    const latestSteps = dateSteps.length
      ? [...dateSteps].sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      })[0]
      : undefined;
    const firstWorkout = workouts.find((w) => w.date === date);

    return {
      mealMode: dateMeals[0]?.mealMode,
      calories: mealTotals.calories || undefined,
      protein: mealTotals.protein || undefined,
      fiber: mealTotals.fiber || undefined,
      sleepHours: sleep?.hours,
      steps: latestSteps?.count,
      stepGoal: latestSteps?.goal,
      workoutType: firstWorkout?.workoutType,
      workoutIntensity: firstWorkout?.workoutIntensity,
      workoutExercise: firstWorkout?.exercise,
      workoutSets: firstWorkout?.sets,
      workoutReps: firstWorkout?.reps,
      workoutWeight: firstWorkout?.weight,
    };
  };

  const handleSaveCheckIn = async (payload: {
    date: string;
    mealMode?: 'quick-light' | 'quick-balanced' | 'quick-heavy' | 'exact';
    calories?: number;
    protein?: number;
    fiber?: number;
    sleepHours?: number;
    steps?: number;
    stepGoal?: number;
    workoutType?: 'bodyweight' | 'weighted';
    workoutIntensity?: 'easy' | 'medium' | 'hard';
    workoutExercise?: string;
    workoutSets?: number;
    workoutReps?: number;
    workoutWeight?: number;
  }) => {
    if (!user) return;

    setIsSavingCheckIn(true);
    try {
      if (payload.calories || payload.protein || payload.fiber) {
        await deleteMealsByDate(user.uid, payload.date);
        await addMeal(user.uid, {
          date: payload.date,
          name: 'Daily Check-In',
          calories: payload.calories || 0,
          protein: payload.protein || 0,
          fiber: payload.fiber || 0,
          mealMode: payload.mealMode || 'exact',
        });
      }

      if (payload.workoutExercise && payload.workoutSets && payload.workoutReps) {
        await deleteWorkoutsByDate(user.uid, payload.date);
        await addWorkout(user.uid, {
          date: payload.date,
          exercise: payload.workoutExercise,
          sets: payload.workoutSets,
          reps: payload.workoutReps,
          weight: payload.workoutWeight || 0,
          workoutType: payload.workoutType || 'bodyweight',
          workoutIntensity: payload.workoutType === 'bodyweight' ? payload.workoutIntensity || 'medium' : undefined,
        });
      }

      if (typeof payload.sleepHours === 'number') {
        await upsertSleepLogByDate(user.uid, payload.date, payload.sleepHours);
      }

      if (typeof payload.steps === 'number') {
        await upsertStepsLogByDate(user.uid, payload.date, payload.steps, payload.stepGoal || stepGoal);
      }

      const [workoutData, mealData, sleepData, stepsData] = await Promise.all([
        getWorkouts(user.uid),
        getMeals(user.uid),
        getSleepLogs(user.uid),
        getStepsLogs(user.uid),
      ]);

      setWorkouts(workoutData as Workout[]);
      setMeals(mealData as MealLog[]);
      setSleepLogs(sleepData as SleepLog[]);
      setStepsLogs(stepsData as StepsLog[]);
      if (payload.date === dayjs().format('YYYY-MM-DD') && typeof payload.steps === 'number') {
        setStepsTaken(payload.steps);
        setStepGoal(payload.stepGoal || stepGoal);
      }
      setShowCheckIn(false);
    } finally {
      setIsSavingCheckIn(false);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!user) return;
    try {
      await deleteWorkout(user.uid, id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const filteredWorkouts = workouts.filter((w) => {
    const date = dayjs(w.date);
    if (viewTab === 'today') return date.isSame(dayjs(), 'day');
    if (viewTab === 'yesterday') return date.isSame(dayjs().subtract(1, 'day'), 'day');
    return date.isAfter(dayjs().subtract(7, 'day')) || date.isSame(dayjs().subtract(7, 'day'), 'day');
  });

  const getChartData = () => {
    const grouped = filteredWorkouts.reduce((acc, w) => {
      const date = w.date || dayjs().format('YYYY-MM-DD');
      acc[date] = (acc[date] || 0) + w.weight * w.reps * w.sets;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped)
      .map(([date, volume]) => ({ date: dayjs(date).format('MMM DD'), volume }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const getPieChartData = () => {
    const grouped = filteredWorkouts.reduce((acc, w) => {
      const vol = w.sets * w.reps * w.weight;
      acc[w.exercise] = (acc[w.exercise] || 0) + vol;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const stepsPercent = stepGoal > 0 ? Math.min((stepsTaken / stepGoal) * 100, 100) : 0;
  const goalMetrics = goal ? calculateMetrics(goal) : null;
  const needs = getDailyNeeds(goal);
  const pieData = getPieChartData();
  const chartData = getChartData();

  const todayDate = dayjs().format('YYYY-MM-DD');
  const todayMeals = meals.filter((m) => m.date === todayDate).reduce(
    (acc, curr) => ({ calories: acc.calories + curr.calories, protein: acc.protein + curr.protein }),
    { calories: 0, protein: 0 }
  );
  const todaySleep = sleepLogs.find((s) => s.date === todayDate)?.hours || 0;
  const todayWorkoutCount = workouts.filter((w) => w.date === todayDate).length;
  const todaySteps = stepsTaken;

  const completionChecks = {
    meals: todayMeals.calories > 0,
    workout: todayWorkoutCount > 0,
    sleep: todaySleep > 0,
    steps: todaySteps > 0,
  };

  const completedCount = Object.values(completionChecks).filter(Boolean).length;
  const calorieOnTrack = !goal || (goal.goalType === 'weight-loss' ? todayMeals.calories <= needs.dailyCalories : todayMeals.calories >= needs.dailyCalories);
  const proteinOnTrack = !goal || todayMeals.protein >= needs.proteinGrams;
  const sleepOnTrack = todaySleep >= 7;
  const stepsOnTrack = todaySteps >= stepGoal;

  const statusScore = [calorieOnTrack, proteinOnTrack, sleepOnTrack, stepsOnTrack].filter(Boolean).length;
  const statusLabel = statusScore >= 4 ? 'On Track' : statusScore >= 2 ? 'Partially On Track' : 'Off Track';
  const statusColor = statusScore >= 4 ? 'text-green-400 border-green-500/30 bg-green-500/10' : statusScore >= 2 ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10';
  const statusReasons: string[] = [];
  if (!calorieOnTrack) statusReasons.push('calories');
  if (!proteinOnTrack) statusReasons.push('protein');
  if (!sleepOnTrack) statusReasons.push('sleep');
  if (!stepsOnTrack) statusReasons.push('steps');
  const statusReasonText = statusReasons.length > 0 ? `Need attention: ${statusReasons.join(', ')}` : 'Great work — all core metrics are in target range.';

  const getConsecutiveStreak = () => {
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      const mealExists = meals.some((m) => m.date === d);
      const sleepExists = sleepLogs.some((s) => s.date === d);
      const stepsExists = stepsLogs.some((s) => s.date === d && (s.count || 0) > 0);
      if (mealExists && sleepExists && stepsExists) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = getConsecutiveStreak();
  const missingSleepDays = Array.from({ length: 3 }).filter((_, i) => !sleepLogs.some((s) => s.date === dayjs().subtract(i, 'day').format('YYYY-MM-DD'))).length;
  const missingMealDays = Array.from({ length: 3 }).filter((_, i) => !meals.some((m) => m.date === dayjs().subtract(i, 'day').format('YYYY-MM-DD'))).length;

  if (userLoading || goalLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="text-white max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter drop-shadow-md">
            Welcome back, <span className="text-gradient">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-muted mt-1">{dayjs().format('dddd, MMMM D, YYYY')}</p>
        </div>
        {goal && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-sunset/10 border border-orange-500/30 rounded-xl backdrop-blur-md shadow-lg shadow-orange-500/10">
            <Target className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-orange-500 font-bold tracking-tight">
              {formatGoalType(goal.goalType)} &middot; {goal.currentWeight}kg → {goal.targetWeight}kg
            </span>
          </div>
        )}
      </div>

      <Card className="!p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${statusColor}`}>
              {statusScore >= 3 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {statusLabel}
            </div>
            <p className="text-sm text-muted">Daily completion: <span className="text-white font-semibold">{completedCount}/4</span> (Meals, Workout, Sleep, Steps)</p>
            <p className="text-xs text-muted/70">{statusReasonText}</p>
            {streak > 0 && <p className="text-sm text-accent-hover">🔥 {streak}-day consistency streak</p>}
            {missingMealDays >= 2 && <p className="text-xs text-yellow-400">You missed meal logs for {missingMealDays} of last 3 days.</p>}
            {missingSleepDays >= 2 && <p className="text-xs text-yellow-400">You missed sleep logs for {missingSleepDays} of last 3 days.</p>}
          </div>

          <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full lg:w-auto items-center">
            <div className="bg-white/5 border border-white/5 backdrop-blur-md rounded-xl p-1 flex shadow-inner w-full sm:w-auto">
              {(['today', 'yesterday', 'week'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setViewTab(tab)}
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs rounded-lg capitalize transition-all font-bold tracking-wide ${viewTab === tab ? 'bg-gradient-sunset text-white shadow-md scale-100' : 'text-white/50 hover:text-white hover:bg-white/5 scale-95 hover:scale-100'
                    }`}
                >
                  {tab === 'week' ? 'This Week' : tab}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCheckIn(true)}
              className="w-full sm:w-auto px-6 py-2.5 text-sm bg-gradient-sunset hover:bg-gradient-sunset-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/40 hover:shadow-xl shadow-orange-500/60 hover:scale-105"
            >
              {viewTab === 'today' ? "Complete Today's Check-In" : viewTab === 'yesterday' ? "Update Yesterday's Check-In" : 'Open Daily Check-In'}
            </button>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      {goalMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted">Daily Calories</p>
                <p className="text-lg font-bold">{goalMetrics.dailyCalories} <span className="text-xs text-muted/70 font-normal">kcal</span></p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted">Protein Target</p>
                <p className="text-lg font-bold">{goalMetrics.proteinGrams}<span className="text-xs text-muted/70 font-normal">g</span></p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Footprints className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-muted">Steps Today</p>
                <p className="text-lg font-bold">{stepsTaken.toLocaleString()} <span className="text-xs text-muted/70 font-normal">/ {stepGoal.toLocaleString()}</span></p>
              </div>
            </div>
          </Card>
          <Card className="!p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-xs text-muted">Workouts Logged</p>
                <p className="text-lg font-bold">{filteredWorkouts.length}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Smart Summary */}
      <SmartSummary />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Workout Section */}
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-accent" />
                Workouts
              </h2>
              <button
                onClick={() => setShowWorkoutForm(!showWorkoutForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent hover:bg-orange-600 text-white rounded-lg transition"
              >
                <Plus className="w-4 h-4" />
                Quick Add
              </button>
            </div>

            {showWorkoutForm && (
              <form onSubmit={handleAddWorkout} className="space-y-3 mb-4 pb-4 border-b border-white/5">
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm"
                  required
                />
                <div className="grid grid-cols-3 gap-3">
                  <input type="number" placeholder="Sets" value={sets} onChange={(e) => setSets(e.target.value)} className="px-3 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm" required min="1" />
                  <input type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} className="px-3 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm" required min="1" />
                  <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="px-3 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm" required min="0" />
                </div>
                <button className="w-full bg-accent hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm transition">
                  Log Workout
                </button>
              </form>
            )}

            {filteredWorkouts.length === 0 ? (
              <p className="text-muted/70 text-sm text-center py-8">No workouts logged yet. Tap &quot;Add&quot; to start.</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {[...filteredWorkouts].reverse().map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm shadow-inner rounded-lg group"
                  >
                    <div>
                      <p className="text-sm font-medium">{w.exercise}</p>
                      {w.workoutType === 'bodyweight' ? (
                        <p className="text-xs text-muted/70">{w.sets}×{w.reps} bodyweight {w.workoutIntensity ? `· ${w.workoutIntensity}` : ''}</p>
                      ) : (
                        <p className="text-xs text-muted/70">{w.sets}×{w.reps} @ {w.weight}kg &middot; Vol: {w.sets * w.reps * w.weight}kg</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteWorkout(w.id)}
                      className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Step Tracker */}
          <Card>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Footprints className="w-5 h-5 text-green-500" />
              Step Tracker
            </h2>

            {/* Step progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted">{stepsTaken.toLocaleString()} steps</span>
                <span className="text-muted/70">Goal: {stepGoal.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-white\/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${stepsPercent}%` }}
                />
              </div>
              <p className="text-xs text-muted/70 mt-1.5">{Math.round(stepsPercent)}% complete</p>
            </div>

            <form onSubmit={handleAddSteps} className="flex gap-2">
              <input
                type="number"
                placeholder="Add steps..."
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm"
                required
                min="1"
              />
              <button className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition">
                Add
              </button>
            </form>

            <div className="mt-3 flex gap-2">
              <label className="text-xs text-muted/70 self-center">Daily goal:</label>
              <input
                type="number"
                value={stepGoal}
                onChange={(e) => {
                  const g = Number(e.target.value);
                  setStepGoal(g);
                  saveSteps(stepsTaken, g);
                }}
                className="w-24 px-3 py-1.5 bg-black/40 backdrop-blur-sm shadow-inner border border-white/10 rounded-lg text-white text-xs"
                min="1000"
                step="1000"
              />
            </div>
          </Card>
        </div>

        {/* Right: Sleep + Meal */}
        <div className="space-y-6">
          <SleepTracker />
          <MealTracker />
        </div>
      </div>

      {/* Charts Section */}
      {filteredWorkouts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">Volume Over Time</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                  itemStyle={{ color: '#f97316' }}
                />
                <Bar dataKey="volume" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4">Exercise Distribution</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Calendar */}
      <DailyStatusCalendar />

      <DailyCheckInModal
        open={showCheckIn}
        date={getCheckInDate()}
        initialData={getInitialCheckInData(getCheckInDate())}
        isSaving={isSavingCheckIn}
        onCancel={() => setShowCheckIn(false)}
        onSubmit={handleSaveCheckIn}
      />
    </div>
  );
}
