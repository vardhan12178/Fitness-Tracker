import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import Badges from "./Badges";
import "./GoalProgress.css";

const GoalProgress = () => {
  const { plannedActivities, selectedDay, goals } = useContext(AppContext);

  const dailyStepsGoal = goals?.dailySteps || 10000;
  const dailyCaloriesGoal = goals?.dailyCalories || 500;

  const activitiesForDay = plannedActivities.filter(
    (activity) => new Date(activity.date).getDate() === selectedDay
  );

  const totalSteps = activitiesForDay.reduce((acc, activity) => acc + (activity.steps || 0), 0);
  const totalCalories = activitiesForDay.reduce((acc, activity) => acc + (activity.calories || 0), 0);

  const stepsProgress = Math.min((totalSteps / dailyStepsGoal) * 100, 100);
  const caloriesProgress = Math.min((totalCalories / dailyCaloriesGoal) * 100, 100);

  const milestones = [];
  if (totalSteps >= 10000) {
    milestones.push({ icon: "🏅", name: "10,000 Steps" });
  }
  if (totalCalories >= 500) {
    milestones.push({ icon: "🔥", name: "500 Calories Burned" });
  }

  return (
    <div className="goal-progress-container">
      <h2>Daily Goals Progress</h2>

      <div className="progress-section">
        <div className="progress-item">
          <h3>Steps</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${stepsProgress}%` }}>
              {Math.round(stepsProgress)}%
            </div>
          </div>
          <p>
            {totalSteps.toLocaleString()} / {dailyStepsGoal.toLocaleString()} steps
            <span className={totalSteps >= dailyStepsGoal ? "goal-achieved" : "goal-missed"}>
              {totalSteps >= dailyStepsGoal ? "🎯 Goal Achieved!" : "🚀 Keep Going!"}
            </span>
          </p>
        </div>

        <div className="progress-item">
          <h3>Calories Burned</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${caloriesProgress}%` }}>
              {Math.round(caloriesProgress)}%
            </div>
          </div>
          <p>
            {totalCalories.toLocaleString()} / {dailyCaloriesGoal.toLocaleString()} kcal
            <span className={totalCalories >= dailyCaloriesGoal ? "goal-achieved" : "goal-missed"}>
              {totalCalories >= dailyCaloriesGoal ? "🔥 Goal Achieved!" : "💪 Keep Pushing!"}
            </span>
          </p>
        </div>
      </div>

      {milestones.length > 0 ? (
        <Badges milestones={milestones} />
      ) : (
        <p className="no-milestones">No milestones achieved yet. Keep going! 🚀</p>
      )}
    </div>
  );
};

export default GoalProgress;
