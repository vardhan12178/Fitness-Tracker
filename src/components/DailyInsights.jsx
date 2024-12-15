import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import "./DailyInsights.css";

const DailyInsights = () => {
  const { nutrition, plannedActivities } = useContext(AppContext);


  const totalCaloriesConsumed = nutrition.reduce(
    (acc, item) => acc + item.calories,
    0
  );

  const totalCaloriesBurned = plannedActivities.reduce(
    (acc, activity) => acc + activity.calories,
    0
  );


  const calorieBalance = totalCaloriesConsumed - totalCaloriesBurned;

  return (
    <div className="daily-insights">
      <h2>Daily Insights</h2>
      <div className="insight-item">
        <span role="img" aria-label="food">🍽️</span>
        <strong>Calories Consumed:</strong> {totalCaloriesConsumed} kcal
      </div>
      <div className="insight-item">
        <span role="img" aria-label="fire">🔥</span>
        <strong>Calories Burned:</strong> {totalCaloriesBurned} kcal
      </div>
      <div className={`insight-item balance ${calorieBalance >= 0 ? "positive" : "negative"}`}>
        <span role="img" aria-label="balance">⚖️</span>
        <strong>Calorie Balance:</strong> {calorieBalance} kcal
      </div>
      {calorieBalance < 0 ? (
        <p className="warning">⚠️ You are consuming more calories than you are burning!</p>
      ) : (
        <p className="success">🎉 Your calorie intake is on track!</p>
      )}
    </div>
  );
};

export default DailyInsights;
