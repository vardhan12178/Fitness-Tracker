import React, { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import "./Nutrition.css";

const Nutrition = () => {
  const { nutrition, setNutrition } = useContext(AppContext);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");


  const handleAddMeal = () => {
    if (mealName && calories > 0) {
      const newMeal = { name: mealName, calories: parseInt(calories) };
      setNutrition([...nutrition, newMeal]); 
      setMealName("");
      setCalories("");
    }
  };

  const totalCaloriesConsumed = nutrition.reduce(
    (total, meal) => total + meal.calories,
    0
  );

  return (
    <div className="nutrition">
      <h2>Nutrition Tracker</h2>
      {/* Add Meal Form */}
      <div className="nutrition-form">
        <input
          type="text"
          placeholder="Meal Name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />
        <button onClick={handleAddMeal}>Add Meal</button>
      </div>

      {/* Display Meals */}
      <div className="meal-list">
        <h3>Logged Meals</h3>
        {nutrition.length > 0 ? (
          nutrition.map((meal, index) => (
            <div key={index} className="meal-item">
              <span>{meal.name}</span>
              <span>{meal.calories} kcal</span>
            </div>
          ))
        ) : (
          <p>No meals logged yet.</p>
        )}
      </div>

      {/* Calorie Summary */}
      <div className="calorie-summary">
        <h3>Total Calories Consumed</h3>
        <p>{totalCaloriesConsumed} kcal</p>
      </div>
    </div>
  );
};

export default Nutrition;
