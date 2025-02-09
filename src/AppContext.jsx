import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [goals, setGoals] = useState(() => {
    const savedGoals = JSON.parse(localStorage.getItem("userGoals"));
    return savedGoals || {
      name: "",
      age: "",
      gender: "male",
      currentWeight: null,
      targetWeight: null,
      timeFrame: null,
      goalStartDate: new Date().toISOString().split("T")[0],
      dailyCalories: 2000,
      dailySteps: 8000,
    };
  });

  const [plannedActivities, setPlannedActivities] = useState(() => {
    const savedActivities = JSON.parse(localStorage.getItem("plannedActivities"));
    return Array.isArray(savedActivities) ? savedActivities : [];
  });

  const [nutrition, setNutrition] = useState(() => {
    const savedMeals = JSON.parse(localStorage.getItem("nutritionData"));
    return savedMeals || {};
  });

  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    localStorage.setItem("plannedActivities", JSON.stringify(plannedActivities));
  }, [plannedActivities]);

  useEffect(() => {
    localStorage.setItem("nutritionData", JSON.stringify(nutrition));
  }, [nutrition]);

  const addActivity = (activity) => {
    setPlannedActivities((prevActivities) => {
      const updatedActivities = Array.isArray(prevActivities) ? [...prevActivities, activity] : [activity];
      localStorage.setItem("plannedActivities", JSON.stringify(updatedActivities));
      return updatedActivities;
    });
  };

  const addMeal = (meal) => {
    setNutrition((prevNutrition) => ({
      ...prevNutrition,
      [selectedDay]: [...(prevNutrition[selectedDay] || []), meal],
    }));
  };

  const totalCaloriesConsumed = (nutrition[selectedDay] || []).reduce(
    (total, meal) => total + meal.calories,
    0
  );

  const resetAllData = () => {
    setGoals({
      name: "",
      age: "",
      gender: "male",
      currentWeight: null,
      targetWeight: null,
      timeFrame: null,
      goalStartDate: new Date().toISOString().split("T")[0],
      dailyCalories: 2000,
      dailySteps: 8000,
    });

    setPlannedActivities([]);
    setNutrition({});
    setSelectedDay(new Date().toISOString().split("T")[0]);

    localStorage.removeItem("userGoals");
    localStorage.removeItem("plannedActivities");
    localStorage.removeItem("nutritionData");
  };

  return (
    <AppContext.Provider
      value={{
        goals,
        setGoals,
        plannedActivities,
        setPlannedActivities,
        addActivity,
        nutrition,
        setNutrition,
        addMeal,
        selectedDay,
        setSelectedDay,
        totalCaloriesConsumed,
        resetAllData, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
