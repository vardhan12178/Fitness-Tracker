import type { GoalData } from '../context/GoalContext';

export interface GoalMetrics {
  goalType: string;
  dailyCalories: number;
  proteinGrams: number;
  fiberGrams: number;
  dailyCalorieDeficit: number;
  weeklyWeightChange: number;
}

export function calculateMetrics(goal: GoalData): GoalMetrics {
  const { goalType, currentWeight, targetWeight, timeframe } = goal;
  const totalWeightChange = Math.abs(targetWeight - currentWeight);
  const totalCalories = totalWeightChange * 7700;
  const dailyCalorieDeficit = Math.round(totalCalories / timeframe);
  const weeklyWeightChange = (totalWeightChange / timeframe) * 7;

  return {
    goalType,
    dailyCalories: dailyCalorieDeficit,
    proteinGrams: Math.round(currentWeight * 1.6),
    fiberGrams: 25,
    dailyCalorieDeficit,
    weeklyWeightChange: Math.round(weeklyWeightChange * 100) / 100,
  };
}

export function getDailyNeeds(goal: GoalData | null) {
  if (!goal) return { dailyCalories: 0, proteinGrams: 0, fiberGrams: 25 };
  const metrics = calculateMetrics(goal);
  return {
    dailyCalories: metrics.dailyCalories,
    proteinGrams: metrics.proteinGrams,
    fiberGrams: metrics.fiberGrams,
  };
}

export function formatGoalType(goalType: string): string {
  return goalType
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}