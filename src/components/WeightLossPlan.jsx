import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import "./WeightLossPlan.css";

const WeightLossPlan = () => {
  const { goals, setGoals } = useContext(AppContext);
  const [daysLeft, setDaysLeft] = useState(goals.timeFrame || 0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!goals.currentWeight || !goals.targetWeight || !goals.timeFrame) return;


    const goalStartDate = localStorage.getItem("goalStartDate") || new Date().toISOString();
    localStorage.setItem("goalStartDate", goalStartDate);

    const daysPassed = Math.floor((new Date() - new Date(goalStartDate)) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(goals.timeFrame - daysPassed, 0);
    setDaysLeft(remainingDays);


    const weightProgress = Math.max(
      ((goals.currentWeight - goals.targetWeight) / (goals.currentWeight || 1)) * 100,
      0
    );
    setProgress(Math.min(weightProgress, 100));
  }, [goals]);

  if (!goals.currentWeight || !goals.targetWeight || !goals.timeFrame) {
    return (
      <div className="weight-loss-plan">
        <h2>Weight Loss Plan</h2>
        <p className="no-goals">Set your weight loss goals to see progress!</p>
      </div>
    );
  }

  let statusMessage = "📊 Keep tracking your activities!";
  let statusClass = "status-off-track";

  if (progress >= 90) {
    statusMessage = "🔥 Almost there! Stay focused!";
    statusClass = "status-almost-there";
  } else if (progress >= 50) {
    statusMessage = "⚡ Great progress! Keep it up!";
    statusClass = "status-on-track";
  } else if (progress < 50 && goals.currentWeight > goals.targetWeight) {
    statusMessage = "✅ Goal Achieved! Maintain your progress.";
    statusClass = "status-goal-achieved";
  }

  return (
    <div className="weight-loss-plan">
      <h2>Weight Loss Plan</h2>
      <div className="plan-details">
        <p>
          <strong>Target Weight:</strong> {goals.targetWeight} kg
        </p>
        <p>
          <strong>Current Weight:</strong> {goals.currentWeight} kg
        </p>
        <p>
          <strong>Days Left:</strong> {daysLeft} days
        </p>
      </div>


      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}>
          {progress > 0 && <span>{Math.round(progress)}%</span>}
        </div>
      </div>

      <p className={`status-message ${statusClass}`}>{statusMessage}</p>

      {progress >= 100 && (
        <div className="success-message">
          🎉 **Congratulations! You have achieved your goal!** 🎯
        </div>
      )}
    </div>
  );
};

export default WeightLossPlan;
