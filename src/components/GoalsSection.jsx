import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppContext";
import "./GoalsSection.css";

const GoalsSection = () => {
  const { goals, setGoals } = useContext(AppContext);
  const [localGoals, setLocalGoals] = useState(goals);
  const [isGoalsSet, setIsGoalsSet] = useState(false);


  useEffect(() => {
    const storedGoals = JSON.parse(localStorage.getItem("userGoals"));
    if (storedGoals) {
      setGoals(storedGoals);
      setLocalGoals(storedGoals);
      setIsGoalsSet(true);
    }
  }, [setGoals]);


  const handleSetGoals = () => {
    setGoals(localGoals);
    localStorage.setItem("userGoals", JSON.stringify(localGoals));
    setIsGoalsSet(true);
  };


  const handleResetGoals = () => {
    setGoals({});
    localStorage.removeItem("userGoals");
    setIsGoalsSet(false);
  };

  return (
    <div className="goals-section">
      <h2>Set Your Goals</h2>
      {isGoalsSet ? (
        <div className="goals-summary">
          <p>
            <strong>Current Weight:</strong> {localGoals.currentWeight} kg
          </p>
          <p>
            <strong>Target Weight:</strong> {localGoals.targetWeight} kg
          </p>
          <p>
            <strong>Days Left:</strong> {localGoals.timeFrame} days
          </p>
          <button onClick={handleResetGoals}>Reset Goals</button>
        </div>
      ) : (
        <div className="goals-form">
          <input
            type="number"
            placeholder="Current Weight (kg)"
            onChange={(e) => setLocalGoals({ ...localGoals, currentWeight: e.target.value })}
          />
          <input
            type="number"
            placeholder="Target Weight (kg)"
            onChange={(e) => setLocalGoals({ ...localGoals, targetWeight: e.target.value })}
          />
          <input
            type="number"
            placeholder="Time Frame (days)"
            onChange={(e) => setLocalGoals({ ...localGoals, timeFrame: e.target.value })}
          />
          <button onClick={handleSetGoals}>Set Goals</button>
        </div>
      )}
    </div>
  );
};

export default GoalsSection;
