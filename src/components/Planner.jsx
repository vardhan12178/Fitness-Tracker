import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../AppContext";
import { FaDumbbell, FaCalendarAlt, FaClock, FaFire, FaBed, FaWeight } from "react-icons/fa";
import "./Planner.css";

const Planner = () => {
  const { plannedActivities, setPlannedActivities, goals } = useContext(AppContext);
  const todayDate = new Date().toISOString().split("T")[0]; 

  const [activity, setActivity] = useState("");
  const [date, setDate] = useState(todayDate);
  const [duration, setDuration] = useState("");
  const [effort, setEffort] = useState("light");
  const [sleep, setSleep] = useState(""); 
  const [currentWeight, setCurrentWeight] = useState(goals.currentWeight || "");
  const [isSleepSet, setIsSleepSet] = useState(false); 

  useEffect(() => {
    const todayActivity = plannedActivities.find((act) => act.date === todayDate);
    if (todayActivity?.sleep) {
      setSleep(todayActivity.sleep);
      setIsSleepSet(true);
    } else {
      setSleep(""); 
      setIsSleepSet(false);
    }
  }, [plannedActivities, todayDate]);

  const calculateSteps = (duration, effort) => {
    const multiplier = effort === "light" ? 50 : effort === "moderate" ? 100 : 150;
    return duration * multiplier;
  };


  const calculateCalories = (duration, effort) => {
    const multiplier = effort === "light" ? 3 : effort === "moderate" ? 6 : 9;
    return duration * multiplier;
  };

  const handleAddActivity = () => {
    if (!activity || !duration || !sleep || !currentWeight) {
      alert("⚠️ Please fill all required fields before adding an activity.");
      return;
    }

    if (duration <= 0 || sleep <= 0 || currentWeight <= 0) {
      alert("⚠️ Values must be greater than zero!");
      return;
    }

    const newActivity = {
      date,
      activity,
      duration: Number(duration),
      effort,
      sleep: Number(sleep),
      currentWeight: Number(currentWeight),
      steps: calculateSteps(duration, effort),
      calories: calculateCalories(duration, effort),
    };


    setPlannedActivities((prevActivities) => [...prevActivities, newActivity]);


    setIsSleepSet(true);


    setActivity("");
    setDuration("");
    setEffort("light");
  };

  return (
    <div className="planner">
      <h2>Activity Planner</h2>
      <div className="planner-form">
        <div className="input-group">
          <label><FaDumbbell className="icon" /> Activity</label>
          <input type="text" placeholder="E.g. Running, Yoga" value={activity} onChange={(e) => setActivity(e.target.value)} />
        </div>
        <div className="input-group">
          <label><FaCalendarAlt className="icon" /> Date</label>
          <input type="date" value={date} readOnly />
        </div>
        <div className="input-group">
          <label><FaClock className="icon" /> Duration (mins)</label>
          <input type="number" placeholder="Enter minutes" value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
        <div className="input-group">
          <label><FaFire className="icon" /> Effort</label>
          <select value={effort} onChange={(e) => setEffort(e.target.value)}>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="intense">Intense</option>
          </select>
        </div>
        <div className="input-group">
          <label><FaBed className="icon" /> Hours Slept</label>
          <input
            type="number"
            placeholder="Enter sleep hours"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            disabled={isSleepSet}
          />
        </div>
        <div className="input-group">
          <label><FaWeight className="icon" /> Current Weight (kg)</label>
          <input
            type="number"
            placeholder="Enter today's weight"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
          />
        </div>
        <button onClick={handleAddActivity} className="add-activity-btn">Add Activity</button>
      </div>
    </div>
  );
};

export default Planner;
