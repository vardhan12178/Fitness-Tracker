import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import "./Planner.css";

const Planner = () => {
  const { plannedActivities, setPlannedActivities } = useContext(AppContext);
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [effort, setEffort] = useState("light");
  const [sleep, setSleep] = useState("");
  const [weightGoal, setWeightGoal] = useState("");

  const handleAddActivity = () => {
    if (activity && date && duration && sleep) {
      const steps = calculateSteps(duration, effort);
      const calories = calculateCalories(duration, effort);

      const newActivity = {
        date,
        activity,
        duration,
        effort,
        sleep,
        weightGoal,
        steps,
        calories,
      };

      setPlannedActivities([...plannedActivities, newActivity]);

    
      setActivity("");
      setDate("");
      setDuration("");
      setEffort("light");
      setSleep("");
      setWeightGoal("");
    }
  };

  const calculateSteps = (duration, effort) => {
    const multiplier = effort === "light" ? 50 : effort === "moderate" ? 100 : 150;
    return duration * multiplier;
  };

  const calculateCalories = (duration, effort) => {
    const multiplier = effort === "light" ? 3 : effort === "moderate" ? 6 : 9;
    return duration * multiplier;
  };

  return (
    <div className="planner">
      <h2>Activity Planner</h2>
      <div className="planner-form">
        <div className="input-group">
          <label>Activity Name</label>
          <input
            type="text"
            placeholder="Enter activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onClick={(e) => e.target.showPicker()} 
          />
        </div>
        <div className="input-group">
          <label>Duration (mins)</label>
          <input
            type="number"
            placeholder="Enter duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label>Effort</label>
          <select value={effort} onChange={(e) => setEffort(e.target.value)}>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="intense">Intense</option>
          </select>
        </div>
        <div className="input-group">
          <label>Hours Slept</label>
          <input
            type="number"
            placeholder="Enter sleep hours"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
          />
        </div>
        <div className="input-group">
          <label>Weight Goal (kg)</label>
          <input
            type="number"
            placeholder="Enter weight goal"
            value={weightGoal}
            onChange={(e) => setWeightGoal(Number(e.target.value))}
          />
        </div>
        <button onClick={handleAddActivity} className="add-activity-btn">
          Add Activity
        </button>
      </div>
    </div>
  );
};

export default Planner;
