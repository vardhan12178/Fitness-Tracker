import React, { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import "./GoalsSection.css";

const GoalsSection = () => {
  const { setGoals, resetAllData } = useContext(AppContext);

  const [localGoals, setLocalGoals] = useState({
    name: "",
    age: "",
    gender: "male",
    currentWeight: "",
    targetWeight: "",
    timeFrame: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleSetGoals = () => {
    const { name, age, currentWeight, targetWeight, timeFrame } = localGoals;

    if (!name || !age || !currentWeight || !targetWeight || !timeFrame) {
      setErrorMessage("⚠️ Please fill in all fields.");
      return;
    }

    const weightDiff = Math.abs(targetWeight - currentWeight);
    if (weightDiff / timeFrame > 1.5 || timeFrame < 30) {
      setErrorMessage("⚠️ Your goal seems unrealistic. Please adjust.");
      return;
    }

    setGoals({ ...localGoals, goalStartDate: new Date().toISOString().split("T")[0] });
    localStorage.setItem("userGoals", JSON.stringify(localGoals));
    setErrorMessage(""); 
  };

  return (
    <div className="goals-section">
      <h2>Set Your Goals</h2>
      <div className="goals-form">
        <input type="text" placeholder="Your Name" value={localGoals.name} onChange={(e) => setLocalGoals({ ...localGoals, name: e.target.value })} />
        <div className="inline-fields">
          <input type="number" placeholder="Age" value={localGoals.age} onChange={(e) => setLocalGoals({ ...localGoals, age: e.target.value })} />
          <select value={localGoals.gender} onChange={(e) => setLocalGoals({ ...localGoals, gender: e.target.value })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <input type="number" placeholder="Current Weight (kg)" value={localGoals.currentWeight} onChange={(e) => setLocalGoals({ ...localGoals, currentWeight: e.target.value })} />
        <input type="number" placeholder="Target Weight (kg)" value={localGoals.targetWeight} onChange={(e) => setLocalGoals({ ...localGoals, targetWeight: e.target.value })} />
        <input type="number" placeholder="Time Frame (days)" value={localGoals.timeFrame} onChange={(e) => setLocalGoals({ ...localGoals, timeFrame: e.target.value })} />
        <div className="buttons-container">
          <button onClick={handleSetGoals} className="set-btn">Set Goals</button>
          <button onClick={resetAllData} className="reset-btn">Reset Goals</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default GoalsSection;
