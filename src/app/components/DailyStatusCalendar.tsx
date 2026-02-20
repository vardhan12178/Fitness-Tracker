'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useGoal } from '../../../context/GoalContext';
import { useUser } from '../../../context/UserContext';
import { getDailyNeeds } from '../../../utils/calculateMetrics';
import { Calendar } from 'lucide-react';
import Card from './Card';
import { getMeals, getSleepLogs } from '@/lib/firestore';

interface DailyData {
  date: string;
  calories: number;
  protein: number;
  sleep: number;
}

export default function DailyStatusCalendar() {
  const { goal } = useGoal();
  const { user } = useUser();
  const [data, setData] = useState<DailyData[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadDailyData = async () => {
      try {
        const [meals, sleep] = await Promise.all([
          getMeals(user.uid),
          getSleepLogs(user.uid),
        ]);

        const grouped: Record<string, DailyData> = {};

        meals.forEach((m: any) => {
          const date = m.date || dayjs().format('YYYY-MM-DD');
          if (!grouped[date]) grouped[date] = { date, calories: 0, protein: 0, sleep: 0 };
          grouped[date].calories += m.calories;
          grouped[date].protein += m.protein;
        });

        sleep.forEach((s: any) => {
          if (!grouped[s.date]) grouped[s.date] = { date: s.date, calories: 0, protein: 0, sleep: 0 };
          grouped[s.date].sleep = s.hours;
        });

        setData(Object.values(grouped));
      } catch (error) {
        console.error('Error loading daily data:', error);
      }
    };

    loadDailyData();
  }, [user]);

  const today = dayjs();
  const days = Array.from({ length: 30 }).map((_, i) =>
    today.subtract(29 - i, 'day').format('YYYY-MM-DD')
  );

  const needs = getDailyNeeds(goal);

  const getStatusColor = (date: string) => {
    const entry = data.find((e) => e.date === date);
    if (!entry || (entry.calories === 0 && entry.protein === 0 && entry.sleep === 0)) {
      return 'bg-white\/5';
    }

    const { calories, protein, sleep } = entry;
    const isLoss = goal?.goalType === 'weight-loss';

    // For weight loss: under calories is good. For gain/bulk: over is good.
    const metCal = needs.dailyCalories > 0
      ? (isLoss ? calories <= needs.dailyCalories : calories >= needs.dailyCalories)
      : true;
    const metProtein = needs.proteinGrams > 0 ? protein >= needs.proteinGrams : true;
    const metSleep = sleep >= 7;

    if (metCal && metProtein && metSleep) return 'bg-green-600';
    if ((metCal && metProtein) || (metCal && metSleep) || (metProtein && metSleep)) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-indigo-500" />
        30-Day Overview
      </h2>

      <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
        {days.map((d) => {
          const isToday = d === today.format('YYYY-MM-DD');
          return (
            <div
              key={d}
              title={`${dayjs(d).format('MMM D, YYYY')}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all hover:scale-110 cursor-default ${getStatusColor(d)} ${
                isToday ? 'ring-2 ring-orange-500 ring-offset-1 ring-offset-[#111827]' : ''
              }`}
            >
              {dayjs(d).format('D')}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-green-600 rounded" />
          All Goals Met
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-yellow-600 rounded" />
          Partial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-red-600 rounded" />
          Off Track
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-white\/5 rounded" />
          No Data
        </span>
      </div>
    </Card>
  );
}
