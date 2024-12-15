import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import "./MealPlanner.css";

const MealPlanner = () => {
  const { goals } = useContext(AppContext);
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState(0);
  const [meals, setMeals] = useState([]);

  const addMeal = () => {
    if (meal && calories > 0) {
      const newMeal = { meal, calories };
      setMeals([...meals, newMeal]);
      setMeal("");
      setCalories(0);
    }
  };

  const totalCalories = meals.reduce((acc, curr) => acc + curr.calories, 0);

  return (
    <div className="meal-planner">
      <h2>Meal Planner</h2>
      <div className="meal-input">
        <input
          type="text"
          placeholder="Enter meal name"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(Number(e.target.value))}
        />
        <button onClick={addMeal}>Add Meal</button>
      </div>
      <div className="meal-list">
        <h3>Today's Meals</h3>
        <ul>
          {meals.map((m, index) => (
            <li key={index}>
              {m.meal}: {m.calories} kcal
            </li>
          ))}
        </ul>
        <p>Total Calories: {totalCalories} / {goals.dailyCalories} kcal</p>
      </div>
    </div>
  );
};

export default MealPlanner;
