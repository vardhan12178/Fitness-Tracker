import React from "react";
import "./Badges.css";

const Badges = ({ milestones }) => {
  return (
    <div className="badges">
      <h2>Your Achievements</h2>
      {milestones.length > 0 ? (
        <div className="badge-list">
          {milestones.map((milestone, index) => (
            <div key={index} className="badge">
              <span>{milestone.icon}</span>
              <p>{milestone.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No milestones achieved yet. Keep pushing!</p>
      )}
    </div>
  );
};

export default Badges;
