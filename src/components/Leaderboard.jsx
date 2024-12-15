import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import "./Leaderboard.css";

const Leaderboard = () => {
  const { plannedActivities } = useContext(AppContext);

  const userSteps = plannedActivities.reduce((acc, curr) => acc + curr.steps, 0);
  const userCalories = plannedActivities.reduce((acc, curr) => acc + curr.calories, 0);

  const leaderboard = [
    { name: "You", steps: userSteps, calories: userCalories },
    { name: "Alice", steps: 12000, calories: 700 },
    { name: "Bob", steps: 15000, calories: 800 },
  ];

  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={index}>
            {user.name}: {user.steps} steps, {user.calories} kcal
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
