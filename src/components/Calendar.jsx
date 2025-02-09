import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import "./Calendar.css";

const Calendar = () => {
  const { plannedActivities, selectedDay, setSelectedDay, goals } = useContext(AppContext);
  const [daysInMonth, setDaysInMonth] = useState(30);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  useEffect(() => {
    const days = new Date(currentYear, currentMonth + 1, 0).getDate();
    setDaysInMonth(days);
  }, [currentMonth, currentYear]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const getDayClass = (day) => {
    let classes = "";

    if (day === currentDay) {
      classes += " today ";
    }

    const activity = plannedActivities.find(
      (activity) => new Date(activity.date).getDate() === day
    );

    if (activity) {
      const stepsMet = activity.steps >= goals.steps;
      const caloriesMet = activity.calories >= goals.calories;
      classes += stepsMet && caloriesMet ? "goal-met " : "goal-not-met ";
    }

    if (selectedDay === day) {
      classes += "selected ";
    }

    return classes.trim();
  };

  return (
    <div className="calendar">
      <h2>Your Active Days</h2>
      <div className="legend">
        <span className="legend-item goal-met">✔ Goal Met</span>
        <span className="legend-item goal-not-met">❌ Goal Not Met</span>
        <span className="legend-item today">📍 Today</span>
        <span className="legend-item selected">📅 Selected Day</span>
      </div>
      <div className="calendar-grid">
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          return (
            <div
              key={i}
              className={`day ${getDayClass(day)}`}
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
