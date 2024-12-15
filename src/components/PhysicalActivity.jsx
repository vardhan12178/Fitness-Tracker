import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { AppContext } from "../AppContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./PhysicalActivity.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    const { width } = chart;
    const { height } = chart;
    const ctx = chart.ctx;
    const type = chart.canvas.id;

    ctx.restore();


    const fontSize = (height / 20).toFixed(2);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff"; 

    const text =
      type === "stepsChart" ? `${chart.data.datasets[0].data[0]} Steps` : `${chart.data.datasets[0].data[0]} Calories`;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillText(text, textX, textY);

    ctx.save();
  },
};

const PhysicalActivity = () => {
  const { plannedActivities, selectedDay, goals } = useContext(AppContext);

  const activitiesForDay = plannedActivities.filter(
    (activity) => new Date(activity.date).getDate() === selectedDay
  );


  const totalSteps = activitiesForDay.reduce((acc, activity) => acc + activity.steps, 0);
  const totalCalories = activitiesForDay.reduce((acc, activity) => acc + activity.calories, 0);

  const remainingSteps = Math.max(goals.dailySteps - totalSteps, 0);
  const remainingCalories = Math.max(goals.dailyCalories - totalCalories, 0);

  const stepsData = {
    labels: ["Achieved", "Remaining"],
    datasets: [
      {
        data: [totalSteps, remainingSteps],
        backgroundColor: ["#4caf50", "#ff9800"],
        hoverBackgroundColor: ["#45a049", "#ffa726"],
      },
    ],
  };


  const caloriesData = {
    labels: ["Achieved", "Remaining"],
    datasets: [
      {
        data: [totalCalories, remainingCalories],
        backgroundColor: ["#4caf50", "#ff9800"],
        hoverBackgroundColor: ["#45a049", "#ffa726"],
      },
    ],
  };

  return (
    <div className="physical-activity">
      <h2>Physical Activity</h2>
      <div className="charts-container">
        <div className="chart-item">
          <Doughnut
            id="stepsChart"
            data={stepsData}
            plugins={[centerTextPlugin]}
            options={{
              cutout: "65%",
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    color: "#ffffff",
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
          <p className="progress-text">{`${totalSteps} / ${goals.dailySteps} steps`}</p>
        </div>
        <div className="chart-item">
          <Doughnut
            id="caloriesChart"
            data={caloriesData}
            plugins={[centerTextPlugin]}
            options={{
              cutout: "65%",
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    color: "#ffffff",
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
          <p className="progress-text">{`${totalCalories} / ${goals.dailyCalories} kcal`}</p>
        </div>
      </div>
    </div>
  );
};

export default PhysicalActivity;
