import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import "./WeightLossPlan.css";

const WeightLossPlan = () => {
  const { goals } = useContext(AppContext);

  return (
    <div className="weight-loss-plan">
      <h2>Weight Loss Plan</h2>
      <p><strong>Target Weight:</strong> {goals.targetWeight} kg</p>
      <p><strong>Current Weight:</strong> {goals.currentWeight} kg</p>
      <p><strong>Time Frame:</strong> {goals.timeFrame} days</p>
      <p className={goals.currentWeight > goals.targetWeight ? "status-on-track" : "status-off-track"}>
        {goals.currentWeight > goals.targetWeight
          ? "Status: On Track!"
          : "Status: Keep tracking your activities!"}
      </p>
    </div>
  );
};

export default WeightLossPlan;
