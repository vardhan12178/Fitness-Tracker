import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  // Goals State
  const [goals, setGoals] = useState(() => {
    const savedGoals = JSON.parse(localStorage.getItem("userGoals"));
    return savedGoals || {
      currentWeight: null,
      targetWeight: null,
      timeFrame: null,
      sleepHours: 7, // Default sleep hours
      dailyCalories: 500,
      dailySteps: 8000,
    };
  });

  // Planned Activities State
  const [plannedActivities, setPlannedActivities] = useState(() => {
    const savedActivities = JSON.parse(localStorage.getItem("plannedActivities"));
    return savedActivities || [];
  });

  // Nutrition State (Meals)
  const [nutrition, setNutrition] = useState(() => {
    const savedMeals = JSON.parse(localStorage.getItem("nutritionData"));
    return savedMeals || [];
  });

  // Selected Day State
  const [selectedDay, setSelectedDay] = useState(null);

  // Search Query State
  const [searchQuery, setSearchQuery] = useState("");

  // Save Goals to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("userGoals", JSON.stringify(goals));
  }, [goals]);

  // Save Planned Activities to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("plannedActivities", JSON.stringify(plannedActivities));
  }, [plannedActivities]);

  // Save Nutrition (meals) to localStorage whenever it updates
  useEffect(() => {
    localStorage.setItem("nutritionData", JSON.stringify(nutrition));
  }, [nutrition]);

  return (
    <AppContext.Provider
      value={{
        goals,
        setGoals,
        plannedActivities,
        setPlannedActivities,
        nutrition,
        setNutrition,
        selectedDay,
        setSelectedDay,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
