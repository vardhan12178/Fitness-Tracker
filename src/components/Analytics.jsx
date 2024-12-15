import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, BarElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from "chart.js";
import "./Analytics.css";


ChartJS.register(
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { plannedActivities } = useContext(AppContext);

  const weeklyData = new Array(7).fill(0); 
  const monthlyData = new Array(30).fill(0); 

  plannedActivities.forEach((activity) => {
    const day = new Date(activity.date).getDate() - 1; 
    const steps = activity.steps;
    weeklyData[day % 7] += steps;
    monthlyData[day] += steps;
  });

  return (
    <div className="analytics">
      <h2>Advanced Analytics</h2>
      <div className="chart-container">
        <h3>Weekly Steps Overview</h3>
        <Line
          data={{
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Steps",
                data: weeklyData,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                fill: true,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: "#ffffff",
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#ffffff" },
              },
              y: {
                ticks: { color: "#ffffff" },
              },
            },
          }}
        />
      </div>
      <div className="chart-container">
        <h3>Monthly Steps Overview</h3>
        <Bar
          data={{
            labels: Array.from({ length: 30 }, (_, i) => i + 1),
            datasets: [
              {
                label: "Steps",
                data: monthlyData,
                backgroundColor: "#42A5F5",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: "#ffffff",
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#ffffff" },
              },
              y: {
                ticks: { color: "#ffffff" },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;
