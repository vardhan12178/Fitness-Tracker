'use client';

import { useEffect, useMemo, useState } from 'react';

type CheckInData = {
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
};

interface DailyCheckInModalProps {
  open: boolean;
  date: string;
  isSaving?: boolean;
  initialData?: Partial<CheckInData>;
  onCancel: () => void;
  onSubmit: (data: CheckInData) => Promise<void>;
}

const steps = ['Meals', 'Workout', 'Sleep', 'Steps'];

export default function DailyCheckInModal({
  open,
  date,
  isSaving = false,
  initialData,
  onCancel,
  onSubmit,
}: DailyCheckInModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [mealMode, setMealMode] = useState<'quick-light' | 'quick-balanced' | 'quick-heavy' | 'exact'>('quick-balanced');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fiber, setFiber] = useState('');
  const [didWorkout, setDidWorkout] = useState(true);
  const [workoutType, setWorkoutType] = useState<'bodyweight' | 'weighted'>('bodyweight');
  const [workoutIntensity, setWorkoutIntensity] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [workoutExercise, setWorkoutExercise] = useState('');
  const [workoutSets, setWorkoutSets] = useState('');
  const [workoutReps, setWorkoutReps] = useState('');
  const [workoutWeight, setWorkoutWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [stepsCount, setStepsCount] = useState('');
  const [stepsGoal, setStepsGoal] = useState('8000');

  const handleSelectMealMode = (mode: 'quick-light' | 'quick-balanced' | 'quick-heavy' | 'exact') => {
    if (mode === 'exact' && mealMode !== 'exact') {
      setCalories('');
      setProtein('');
      setFiber('');
    }
    setMealMode(mode);
  };

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    setMealMode(initialData?.mealMode || 'quick-balanced');
    setCalories(initialData?.calories?.toString() || '');
    setProtein(initialData?.protein?.toString() || '');
    setFiber(initialData?.fiber?.toString() || '');
    const hasWorkout = !!initialData?.workoutExercise;
    setDidWorkout(hasWorkout);
    setWorkoutType(initialData?.workoutType || 'bodyweight');
    setWorkoutIntensity(initialData?.workoutIntensity || 'medium');
    setWorkoutExercise(initialData?.workoutExercise || '');
    setWorkoutSets(initialData?.workoutSets?.toString() || '');
    setWorkoutReps(initialData?.workoutReps?.toString() || '');
    setWorkoutWeight(initialData?.workoutWeight?.toString() || '');
    setSleepHours(initialData?.sleepHours?.toString() || '');
    setStepsCount(initialData?.steps?.toString() || '');
    setStepsGoal(initialData?.stepGoal?.toString() || '8000');
  }, [open, initialData]);

  useEffect(() => {
    if (mealMode === 'exact') return;
    if (mealMode === 'quick-light') {
      setCalories('1700');
      setProtein('90');
      setFiber('18');
    }
    if (mealMode === 'quick-balanced') {
      setCalories('2200');
      setProtein('130');
      setFiber('28');
    }
    if (mealMode === 'quick-heavy') {
      setCalories('2800');
      setProtein('170');
      setFiber('35');
    }
  }, [mealMode]);

  const canGoNext = useMemo(() => {
    if (stepIndex === 0) return true;
    if (stepIndex === 1) {
      if (!didWorkout) return true;
      if (!workoutExercise.trim()) return false;
      return !!workoutSets && !!workoutReps;
    }
    return true;
  }, [stepIndex, didWorkout, workoutExercise, workoutSets, workoutReps]);

  if (!open) return null;

  const handleSubmit = async () => {
    await onSubmit({
      date,
      mealMode,
      calories: calories ? Number(calories) : undefined,
      protein: protein ? Number(protein) : undefined,
      fiber: fiber ? Number(fiber) : undefined,
      workoutType: didWorkout ? workoutType : undefined,
      workoutIntensity: didWorkout && workoutType === 'bodyweight' ? workoutIntensity : undefined,
      workoutExercise: didWorkout ? workoutExercise.trim() || undefined : undefined,
      workoutSets: didWorkout ? (workoutSets ? Number(workoutSets) : undefined) : undefined,
      workoutReps: didWorkout ? (workoutReps ? Number(workoutReps) : undefined) : undefined,
      workoutWeight: didWorkout && workoutType === 'weighted' ? (workoutWeight ? Number(workoutWeight) : 0) : 0,
      sleepHours: sleepHours ? Number(sleepHours) : undefined,
      steps: stepsCount ? Number(stepsCount) : undefined,
      stepGoal: stepsGoal ? Number(stepsGoal) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative w-full max-w-2xl bg-[#111827] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Daily Check-In</h3>
            <p className="text-sm text-gray-400 mt-1">Log progress for {date}</p>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">×</button>
        </div>

        <div className="flex items-center gap-2 mb-5">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full text-xs flex items-center justify-center border ${
                  index <= stepIndex
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                    : 'bg-[#030712] text-gray-500 border-gray-700'
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-xs ${index <= stepIndex ? 'text-gray-300' : 'text-gray-500'}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#030712] border border-gray-800 rounded-xl p-4 min-h-[220px]">
          {stepIndex === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-300">Don&apos;t know exact macros? Use a quick estimate and adjust later.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => handleSelectMealMode('quick-light')} className={`px-3 py-1.5 text-xs rounded-lg border ${mealMode === 'quick-light' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' : 'text-gray-400 border-gray-700'}`}>Light Day</button>
                <button type="button" onClick={() => handleSelectMealMode('quick-balanced')} className={`px-3 py-1.5 text-xs rounded-lg border ${mealMode === 'quick-balanced' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' : 'text-gray-400 border-gray-700'}`}>Balanced Day</button>
                <button type="button" onClick={() => handleSelectMealMode('quick-heavy')} className={`px-3 py-1.5 text-xs rounded-lg border ${mealMode === 'quick-heavy' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' : 'text-gray-400 border-gray-700'}`}>Heavy Day</button>
                <button type="button" onClick={() => handleSelectMealMode('exact')} className={`px-3 py-1.5 text-xs rounded-lg border ${mealMode === 'exact' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'text-gray-400 border-gray-700'}`}>I know exact values</button>
              </div>
              <div className="rounded-lg border border-gray-800 bg-[#111827] p-3 text-xs text-gray-400">
                Example meal references: 2 eggs + toast ≈ 320 kcal, 18g protein · Chicken bowl ≈ 600 kcal, 40g protein
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Calories (kcal)</label>
                  <input type="number" min="0" placeholder="e.g. 2200" value={calories} onChange={(e) => setCalories(e.target.value)} className="w-full px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Protein (g)</label>
                  <input type="number" min="0" placeholder="e.g. 130" value={protein} onChange={(e) => setProtein(e.target.value)} className="w-full px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Fiber (g)</label>
                  <input type="number" min="0" placeholder="e.g. 28" value={fiber} onChange={(e) => setFiber(e.target.value)} className="w-full px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
                </div>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-300">Did you train today?</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setDidWorkout(false)} className={`px-3 py-1.5 text-xs rounded-lg border ${!didWorkout ? 'bg-gray-700 text-white border-gray-500' : 'text-gray-400 border-gray-700'}`}>No workout today</button>
                <button type="button" onClick={() => setDidWorkout(true)} className={`px-3 py-1.5 text-xs rounded-lg border ${didWorkout ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' : 'text-gray-400 border-gray-700'}`}>I worked out</button>
              </div>

              {didWorkout && (
                <>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setWorkoutType('bodyweight')} className={`px-3 py-1.5 text-xs rounded-lg border ${workoutType === 'bodyweight' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'text-gray-400 border-gray-700'}`}>Bodyweight</button>
                    <button type="button" onClick={() => setWorkoutType('weighted')} className={`px-3 py-1.5 text-xs rounded-lg border ${workoutType === 'weighted' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'text-gray-400 border-gray-700'}`}>Weighted</button>
                  </div>

                  <input type="text" placeholder={workoutType === 'bodyweight' ? 'Exercise (e.g. Push-ups)' : 'Exercise (e.g. Bench press)'} value={workoutExercise} onChange={(e) => setWorkoutExercise(e.target.value)} className="w-full px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
                  <div className={`grid gap-3 ${workoutType === 'weighted' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'}`}>
                    <input type="number" min="1" placeholder="Sets" value={workoutSets} onChange={(e) => setWorkoutSets(e.target.value)} className="px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
                    <input type="number" min="1" placeholder="Reps" value={workoutReps} onChange={(e) => setWorkoutReps(e.target.value)} className="px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
                    {workoutType === 'weighted' ? (
                      <input type="number" min="0" placeholder="Weight (kg)" value={workoutWeight} onChange={(e) => setWorkoutWeight(e.target.value)} className="px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
                    ) : (
                      <select value={workoutIntensity} onChange={(e) => setWorkoutIntensity(e.target.value as 'easy' | 'medium' | 'hard')} className="px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm">
                        <option value="easy">Effort: Easy</option>
                        <option value="medium">Effort: Medium</option>
                        <option value="hard">Effort: Hard</option>
                      </select>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-300">How many hours did you sleep?</p>
              <input type="number" min="0" max="24" step="0.5" placeholder="Sleep hours" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} className="w-full md:w-60 px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-300">Add your total steps for the day and goal.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="number" min="0" placeholder="Steps" value={stepsCount} onChange={(e) => setStepsCount(e.target.value)} className="px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
                <input type="number" min="1000" step="1000" placeholder="Step goal" value={stepsGoal} onChange={(e) => setStepsGoal(e.target.value)} className="px-3 py-2.5 bg-[#111827] border border-gray-700 rounded-lg text-white text-sm" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-between">
          <button
            onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={stepIndex === 0 || isSaving}
            className="px-4 py-2 text-sm border border-gray-700 rounded-lg text-gray-300 disabled:opacity-50"
          >
            Back
          </button>

          {stepIndex < steps.length - 1 ? (
            <button
              onClick={() => setStepIndex((prev) => prev + 1)}
              disabled={!canGoNext || isSaving}
              className="px-4 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 rounded-lg text-white disabled:opacity-60"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 rounded-lg text-white disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save Check-In'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
