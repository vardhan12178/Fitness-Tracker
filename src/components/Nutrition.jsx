import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import "./Nutrition.css";

const Nutrition = () => {
  const { addMeal, selectedDay, nutrition } = useContext(AppContext);
  const [mealName, setMealName] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [category, setCategory] = useState("Lunch");


  const nutritionDB = {
    "Idli": { calories: 75, protein: 2, carbs: 15, fats: 0.5 },
    "Dosa": { calories: 180, protein: 4, carbs: 35, fats: 4 },
    "Chapati": { calories: 100, protein: 3, carbs: 20, fats: 2 },
    "Paratha": { calories: 250, protein: 6, carbs: 30, fats: 10 },
    "Rice": { calories: 200, protein: 4, carbs: 45, fats: 1 },
    "Dal": { calories: 180, protein: 8, carbs: 30, fats: 3 },
    "Biryani": { calories: 350, protein: 12, carbs: 45, fats: 10 },
    "Egg": { calories: 70, protein: 6, carbs: 1, fats: 5 },
    "Chicken": { calories: 250, protein: 20, carbs: 5, fats: 15 },
    "Fish": { calories: 220, protein: 22, carbs: 2, fats: 12 },
  };

  const parsePortion = (input) => {
    const match = input.match(/^(\d+)\s+/);
    return match ? parseInt(match[1]) : 1;
  };

  const extractFoodName = (input) => {
    return input.replace(/^\d+\s+/, "").trim();
  };

  const handleAddMeal = () => {
    if (!mealName || !portionSize) return;

    const portion = parsePortion(portionSize);
    const foodName = extractFoodName(mealName);
    const foodData = nutritionDB[foodName] || { calories: 100, protein: 2, carbs: 15, fats: 1 };

    const mealData = {
      name: foodName,
      portion,
      category,
      calories: foodData.calories * portion,
      protein: foodData.protein * portion,
      carbs: foodData.carbs * portion,
      fats: foodData.fats * portion,
    };

    addMeal(mealData);
    setMealName("");
    setPortionSize("");
  };

  return (
    <div className="nutrition">
      <h2>Nutrition Tracker</h2>
      <div className="nutrition-form">
        <input type="text" placeholder="Meal Name (e.g. 2 Idli)" value={mealName} onChange={(e) => setMealName(e.target.value)} list="food-suggestions" />
        <datalist id="food-suggestions">
          {Object.keys(nutritionDB).map((food, index) => (
            <option key={index} value={`1 ${food}`} />
          ))}
        </datalist>
        <input type="text" placeholder="Portion (e.g. 2, 1 Cup, 100g)" value={portionSize} onChange={(e) => setPortionSize(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>
        <button onClick={handleAddMeal}>Add Meal</button>
      </div>

      <div className="meal-list">
        <h3>Logged Meals for {selectedDay}</h3>
        {nutrition[selectedDay]?.length > 0 ? (
          nutrition[selectedDay].map((meal, index) => (
            <div key={index} className="meal-item">
              <span>{meal.portion} {meal.name} - {meal.category}</span>
              <span>{meal.calories} kcal</span>
            </div>
          ))
        ) : (
          <p>No meals logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
