import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import Badges from "./Badges";
import "./GoalProgress.css";

const GoalProgress = () => {
  const { plannedActivities, selectedDay, goals } = useContext(AppContext);

  const activitiesForDay = plannedActivities.filter(
    (activity) => new Date(activity.date).getDate() === selectedDay
  );

  const totalSteps = activitiesForDay.reduce((acc, activity) => acc + activity.steps, 0);
  const totalCalories = activitiesForDay.reduce((acc, activity) => acc + activity.calories, 0);

  const stepsProgress = Math.min((totalSteps / goals.dailySteps) * 100, 100);
  const caloriesProgress = Math.min((totalCalories / goals.dailyCalories) * 100, 100);

  const milestones = [];
  if (totalSteps >= 10000) {
    milestones.push({ icon: "🏅", name: "10,000 Steps" });
  }
  if (totalCalories >= 500) {
    milestones.push({ icon: "🔥", name: "500 Calories Burned" });
  }

  return (
    <div className="goals-progress">
      <h2>Daily Goals Progress</h2>
      <div className="progress-item">
        <h3>Steps</h3>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${stepsProgress}%` }}></div>
        </div>
        <p>
          {totalSteps} / {goals.dailySteps} steps
          <span className={totalSteps >= goals.dailySteps ? "goal-achieved" : "goal-missed"}>
            {totalSteps >= goals.dailySteps ? "Goal Achieved!" : "Keep Going!"}
          </span>
        </p>
      </div>
      <div className="progress-item">
        <h3>Calories Burned</h3>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${caloriesProgress}%` }}></div>
        </div>
        <p>
          {totalCalories} / {goals.dailyCalories} kcal
          <span className={totalCalories >= goals.dailyCalories ? "goal-achieved" : "goal-missed"}>
            {totalCalories >= goals.dailyCalories ? "Goal Achieved!" : "Keep Going!"}
          </span>
        </p>
      </div>
      {milestones.length > 0 ? (
        <Badges milestones={milestones} />
      ) : (
        <p className="no-milestones">No milestones achieved yet. Keep going!</p>
      )}
    </div>
  );
};

export default GoalProgress;
