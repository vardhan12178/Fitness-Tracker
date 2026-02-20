'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGoal } from '../../../context/GoalContext';
import { useUser } from '../../../context/UserContext';
import { Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GoalSetupPage() {
  const router = useRouter();
  const { setGoal, goal } = useGoal();
  const { user, isLoading } = useUser();

  const [goalType, setGoalType] = useState(goal?.goalType || '');
  const [currentWeight, setCurrentWeight] = useState(goal?.currentWeight?.toString() || '');
  const [targetWeight, setTargetWeight] = useState(goal?.targetWeight?.toString() || '');
  const [timeframe, setTimeframe] = useState(goal?.timeframe?.toString() || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cw = Number(currentWeight);
    const tw = Number(targetWeight);
    const days = Number(timeframe);

    if (!goalType || !cw || !tw || !days) {
      setError('Please fill out all fields');
      return;
    }
    if (cw < 30 || cw > 250) {
      setError('Current weight must be between 30-250 kg');
      return;
    }
    if (tw < 30 || tw > 250) {
      setError('Target weight must be between 30-250 kg');
      return;
    }

    const diff = Math.abs(cw - tw);
    if (goalType === 'weight-loss' && tw >= cw) {
      setError('Target weight should be less than current weight for weight loss');
      return;
    }
    if ((goalType === 'weight-gain' || goalType === 'bulking') && tw <= cw) {
      setError('Target weight should be more than current weight for gaining');
      return;
    }
    if (goalType === 'weight-loss' && diff > 30) {
      setError('A loss of more than 30kg requires medical supervision');
      return;
    }
    if (goalType === 'bulking' && diff > 25) {
      setError('Bulking over 25kg may be unrealistic in one cycle');
      return;
    }
    if (days < 14 || days > 365) {
      setError('Timeframe must be between 14 and 365 days');
      return;
    }

    // Weekly rate check
    const weeklyChange = (diff / days) * 7;
    if (goalType === 'weight-loss' && weeklyChange > 1) {
      setError(`Losing ${weeklyChange.toFixed(1)}kg/week is too aggressive. Extend your timeframe.`);
      return;
    }

    await setGoal({
      goalType: goalType as 'weight-loss' | 'weight-gain' | 'bulking',
      currentWeight: cw,
      targetWeight: tw,
      timeframe: days,
    });

    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-4">
            <Target className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {goal ? 'Update Your Goal' : 'Set Your Fitness Goal'}
          </h1>
          <p className="text-muted mt-2">
            We&apos;ll calculate personalized daily targets based on your goal.
          </p>
        </div>

        <div className="bg-card border border-white/5 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Goal Type</label>
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white focus:border-orange-500"
                required
              >
                <option value="">Select your goal</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="weight-gain">Weight Gain</option>
                <option value="bulking">Bulking</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 75"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 pr-10"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/70 text-sm">kg</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Target Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="e.g. 68"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 pr-10"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/70 text-sm">kg</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Timeframe</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="e.g. 90"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 pr-14"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted/70 text-sm">days</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-accent hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {goal ? 'Update Goal' : 'Set Goal & Start Tracking'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {user && goal && (
          <p className="text-center mt-4">
            <Link href="/dashboard" className="text-sm text-muted/70 hover:text-gray-300 transition">
              Back to Dashboard
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
