import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import "./DailyInsights.css";

const DailyInsights = () => {
  const { goals, totalCaloriesConsumed = 0, plannedActivities = [] } = useContext(AppContext);

  const totalCaloriesBurned = Array.isArray(plannedActivities)
    ? plannedActivities.reduce((acc, activity) => acc + (activity.calories || 0), 0)
    : 0;

  const currentWeight = goals?.currentWeight || 0;
  const targetWeight = goals?.targetWeight || 0;
  const timeFrame = goals?.timeFrame || 30;

  const isGainingWeight = targetWeight > currentWeight;
  const isLosingWeight = targetWeight < currentWeight;

  const averageDailyCalories = 2500;
  const weightDifference = Math.abs(targetWeight - currentWeight);
  const dailyCaloricAdjustment = timeFrame > 0 ? (weightDifference * 7700) / timeFrame : 0;

  let recommendedCalories = averageDailyCalories;
  if (isGainingWeight) {
    recommendedCalories += dailyCaloricAdjustment;
  } else if (isLosingWeight) {
    recommendedCalories -= dailyCaloricAdjustment;
  }

  const calorieBalance = (totalCaloriesConsumed || 0) - (totalCaloriesBurned || 0);
  const calorieGap = recommendedCalories - totalCaloriesConsumed;

  let statusMessage = "Keep tracking your intake!";
  let statusClass = "status-neutral";

  if (isGainingWeight) {
    if (totalCaloriesConsumed >= recommendedCalories) {
      statusMessage = "🔥 You are on track for weight gain!";
      statusClass = "status-gain";
    } else {
      statusMessage = `⚠️ You need to eat ${Math.abs(calorieGap).toFixed(0)} kcal more per day to reach your goal.`;
      statusClass = "status-warning";
    }
  } else if (isLosingWeight) {
    if (totalCaloriesConsumed <= recommendedCalories) {
      statusMessage = "✅ You are on track for weight loss!";
      statusClass = "status-loss";
    } else {
      statusMessage = `⚠️ You need to reduce your intake by ${Math.abs(calorieGap).toFixed(0)} kcal per day.`;
      statusClass = "status-warning";
    }
  }

  return (
    <div className="daily-insights">
      <h2>Daily Insights</h2>

      <div className="insight-item">
        <span role="img" aria-label="food">🍽️</span>
        <strong>Calories Consumed:</strong>
        <span className="insight-value">{(totalCaloriesConsumed || 0).toLocaleString()} kcal</span>
      </div>

      <div className="insight-item">
        <span role="img" aria-label="fire">🔥</span>
        <strong>Calories Burned:</strong>
        <span className="insight-value">{(totalCaloriesBurned || 0).toLocaleString()} kcal</span>
      </div>

      <div className="insight-item">
        <span role="img" aria-label="balance">⚖️</span>
        <strong>Calorie Balance:</strong>
        <span className="insight-value">{(calorieBalance || 0).toLocaleString()} kcal</span>
      </div>

      <div className={`insight-item ${statusClass}`}>
        <span role="img" aria-label="progress">📊</span>
        <strong>Goal Status:</strong>
        <span className="insight-value">{statusMessage}</span>
      </div>

      {statusClass === "status-warning" && (
        <p className="warning">Adjust your calorie intake to stay on track!</p>
      )}
    </div>
  );
};

export default DailyInsights;
