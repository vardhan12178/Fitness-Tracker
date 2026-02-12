'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser } from './UserContext';
import { saveGoal as saveGoalToFirestore, getGoal as getGoalFromFirestore, deleteGoal as deleteGoalFromFirestore } from '@/lib/firestore';

export interface GoalData {
  goalType: 'weight-loss' | 'weight-gain' | 'bulking';
  currentWeight: number;
  targetWeight: number;
  timeframe: number;
}

interface GoalContextType {
  goal: GoalData | null;
  isLoading: boolean;
  setGoal: (goal: GoalData | null) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [goal, setGoalState] = useState<GoalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load goal from Firestore when user is available
  useEffect(() => {
    if (!user) {
      setGoalState(null);
      setIsLoading(false);
      return;
    }

    const loadGoal = async () => {
      try {
        const goalData = await getGoalFromFirestore(user.uid);
        if (goalData) {
          setGoalState({
            goalType: goalData.goalType,
            currentWeight: goalData.currentWeight,
            targetWeight: goalData.targetWeight,
            timeframe: goalData.timeframe,
          });
        } else {
          // Check localStorage as fallback for migration
          const stored = localStorage.getItem('fitnessGoal');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setGoalState(parsed);
              // Migrate to Firestore
              await saveGoalToFirestore(user.uid, parsed);
              localStorage.removeItem('fitnessGoal');
            } catch (err) {
              console.error('Error migrating goal:', err);
            }
          }
        }
      } catch (error) {
        console.error('Error loading goal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoal();
  }, [user]);

  const setGoal = async (data: GoalData | null) => {
    setGoalState(data);
    
    if (!user) return;

    try {
      if (data) {
        await saveGoalToFirestore(user.uid, data);
      } else {
        await deleteGoalFromFirestore(user.uid);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return (
    <GoalContext.Provider value={{ goal, isLoading, setGoal }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (!context) throw new Error('useGoal must be used inside GoalProvider');
  return context;
};
