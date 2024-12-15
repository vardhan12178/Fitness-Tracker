import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import "./Calendar.css";

const Calendar = () => {
  const { plannedActivities, selectedDay, setSelectedDay, goals } = useContext(AppContext);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const getDayClass = (day) => {
    const activity = plannedActivities.find(
      (activity) => new Date(activity.date).getDate() === day
    );
    if (!activity) return "";
    const stepsMet = activity.steps >= goals.steps;
    const caloriesMet = activity.calories >= goals.calories;
    return stepsMet && caloriesMet ? "goal-met" : "goal-not-met";
  };

  return (
    <div className="calendar">
      <h2>Your Active Days</h2>
      <div className="calendar-grid">
        {[...Array(30)].map((_, i) => {
          const day = i + 1;
          return (
            <div
              key={i}
              className={`day ${getDayClass(day)} ${selectedDay === day ? "selected" : ""}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
