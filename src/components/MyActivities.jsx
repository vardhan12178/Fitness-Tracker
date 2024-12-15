import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import "./MyActivities.css";

const MyActivities = () => {
  const { plannedActivities, selectedDay, searchQuery } = useContext(AppContext);

 
  const filteredActivities = plannedActivities
    .filter((activity) => new Date(activity.date).getDate() === selectedDay)
    .filter((activity) =>
      activity.activity.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="my-activities">
      <h2>My Activities</h2>
      {selectedDay ? (
        <p className="selected-date">Activities for {selectedDay}:</p>
      ) : (
        <p className="select-date">Please select a day from the calendar</p>
      )}
      <div className="activities-list">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <h3>{activity.activity}</h3>
              <p><strong>Duration:</strong> {activity.duration} mins</p>
              <p><strong>Effort:</strong> {activity.effort}</p>
              <p><strong>Steps:</strong> {activity.steps}</p>
              <p><strong>Calories:</strong> {activity.calories} kcal</p>
              <p><strong>Hours Slept:</strong> {activity.sleep} hours</p>
              {activity.weightGoal && (
                <p><strong>Weight Goal:</strong> {activity.weightGoal} kg</p>
              )}
            </div>
          ))
        ) : (
          <p className="no-activities">
            {searchQuery
              ? `No activities found for "${searchQuery}".`
              : "No activities planned for this day."}
          </p>
        )}
      </div>
    </div>
  );
};

export default MyActivities;
