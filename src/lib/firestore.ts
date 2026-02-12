import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// Helper to get user's collection reference
const userCollection = (uid: string, collectionName: string) => {
  return collection(db, 'users', uid, collectionName);
};

// ===== GOAL OPERATIONS =====
export const saveGoal = async (uid: string, goalData: any) => {
  const goalRef = doc(db, 'users', uid, 'goal', 'current');
  await setDoc(goalRef, {
    ...goalData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};

export const getGoal = async (uid: string) => {
  const goalRef = doc(db, 'users', uid, 'goal', 'current');
  const goalSnap = await getDoc(goalRef);
  return goalSnap.exists() ? goalSnap.data() : null;
};

export const deleteGoal = async (uid: string) => {
  const goalRef = doc(db, 'users', uid, 'goal', 'current');
  await deleteDoc(goalRef);
};

// ===== WORKOUT OPERATIONS =====
export const addWorkout = async (uid: string, workoutData: any) => {
  const workoutsRef = userCollection(uid, 'workouts');
  const docRef = await addDoc(workoutsRef, {
    ...workoutData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getWorkouts = async (uid: string, startDate?: Date, endDate?: Date) => {
  const workoutsRef = userCollection(uid, 'workouts');
  let q = query(workoutsRef, orderBy('date', 'desc'));
  
  if (startDate && endDate) {
    q = query(
      workoutsRef,
      where('date', '>=', startDate.toISOString().split('T')[0]),
      where('date', '<=', endDate.toISOString().split('T')[0]),
      orderBy('date', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteWorkout = async (uid: string, workoutId: string) => {
  const workoutRef = doc(db, 'users', uid, 'workouts', workoutId);
  await deleteDoc(workoutRef);
};

export const deleteWorkoutsByDate = async (uid: string, date: string) => {
  const workoutsRef = userCollection(uid, 'workouts');
  const q = query(workoutsRef, where('date', '==', date));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
};

// ===== MEAL OPERATIONS =====
export const addMeal = async (uid: string, mealData: any) => {
  const mealsRef = userCollection(uid, 'meals');
  const docRef = await addDoc(mealsRef, {
    ...mealData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getMeals = async (uid: string, startDate?: Date, endDate?: Date) => {
  const mealsRef = userCollection(uid, 'meals');
  let q = query(mealsRef, orderBy('date', 'desc'));
  
  if (startDate && endDate) {
    q = query(
      mealsRef,
      where('date', '>=', startDate.toISOString().split('T')[0]),
      where('date', '<=', endDate.toISOString().split('T')[0]),
      orderBy('date', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteMeal = async (uid: string, mealId: string) => {
  const mealRef = doc(db, 'users', uid, 'meals', mealId);
  await deleteDoc(mealRef);
};

export const deleteMealsByDate = async (uid: string, date: string) => {
  const mealsRef = userCollection(uid, 'meals');
  const q = query(mealsRef, where('date', '==', date));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
};

// ===== SLEEP OPERATIONS =====
export const addSleepLog = async (uid: string, sleepData: any) => {
  const sleepRef = userCollection(uid, 'sleepLogs');
  const docRef = await addDoc(sleepRef, {
    ...sleepData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getSleepLogs = async (uid: string, startDate?: Date, endDate?: Date) => {
  const sleepRef = userCollection(uid, 'sleepLogs');
  let q = query(sleepRef, orderBy('date', 'desc'));
  
  if (startDate && endDate) {
    q = query(
      sleepRef,
      where('date', '>=', startDate.toISOString().split('T')[0]),
      where('date', '<=', endDate.toISOString().split('T')[0]),
      orderBy('date', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteSleepLog = async (uid: string, logId: string) => {
  const logRef = doc(db, 'users', uid, 'sleepLogs', logId);
  await deleteDoc(logRef);
};

export const upsertSleepLogByDate = async (uid: string, date: string, hours: number) => {
  const sleepRef = userCollection(uid, 'sleepLogs');
  const q = query(sleepRef, where('date', '==', date));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return addSleepLog(uid, { date, hours });
};

// ===== STEPS OPERATIONS =====
export const addStepsLog = async (uid: string, stepsData: any) => {
  const stepsRef = userCollection(uid, 'steps');
  const docRef = await addDoc(stepsRef, {
    ...stepsData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getStepsLogs = async (uid: string, startDate?: Date, endDate?: Date) => {
  const stepsRef = userCollection(uid, 'steps');
  let q = query(stepsRef, orderBy('date', 'desc'));
  
  if (startDate && endDate) {
    q = query(
      stepsRef,
      where('date', '>=', startDate.toISOString().split('T')[0]),
      where('date', '<=', endDate.toISOString().split('T')[0]),
      orderBy('date', 'desc')
    );
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteStepsLog = async (uid: string, logId: string) => {
  const logRef = doc(db, 'users', uid, 'steps', logId);
  await deleteDoc(logRef);
};

export const upsertStepsLogByDate = async (uid: string, date: string, count: number, goal: number) => {
  const stepsRef = userCollection(uid, 'steps');
  const q = query(stepsRef, where('date', '==', date));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  return addStepsLog(uid, { date, count, goal });
};

const deleteCollectionDocs = async (uid: string, collectionName: string) => {
  const colRef = userCollection(uid, collectionName);
  const snapshot = await getDocs(colRef);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
};

export const deleteUserData = async (uid: string) => {
  await Promise.all([
    deleteGoal(uid),
    deleteCollectionDocs(uid, 'workouts'),
    deleteCollectionDocs(uid, 'meals'),
    deleteCollectionDocs(uid, 'sleepLogs'),
    deleteCollectionDocs(uid, 'steps'),
  ]);
};
