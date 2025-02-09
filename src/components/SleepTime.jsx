import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./SleepTime.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SleepTime = () => {
  const { plannedActivities, goals, selectedDay } = useContext(AppContext);

  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const sleepData = last7Days.map((day) => {
    const activity = plannedActivities.find((activity) => activity.date === day);
    return {
      date: new Date(day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      sleep: activity ? Number(activity.sleep || 0) : 0,
    };
  });

  const totalSleepLast7Days = sleepData.reduce((sum, entry) => sum + entry.sleep, 0);
  const avgSleep = (totalSleepLast7Days / 7).toFixed(1);

  const data = {
    labels: sleepData.map((d) => d.date),
    datasets: [
      {
        label: "Sleep Hours",
        data: sleepData.map((d) => d.sleep),
        backgroundColor: sleepData.map((d) => d.sleep >= goals.sleepHours ? "#4caf50" : "#ff9800"),
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#ffffff" },
        suggestedMax: 10,
        grid: { color: "#444" },
      },
    },
  };

  return (
    <div className="sleep-time">
      <h2>Sleep Tracker</h2>

      <div className="sleep-summary">
        {selectedDay ? (
          <>
            <p><strong>Selected Day:</strong> {new Date(selectedDay).toLocaleDateString()}</p>
            <p><strong>Total Sleep:</strong> {sleepData.find(d => d.date === selectedDay)?.sleep || 0} hours</p>
            <p className={totalSleepLast7Days >= goals.sleepHours * 7 ? "goal-achieved" : "goal-missed"}>
              {totalSleepLast7Days >= goals.sleepHours * 7
                ? "Great job! You've met your sleep goal."
                : `You need ${(goals.sleepHours * 7 - totalSleepLast7Days).toFixed(1)} more hours this week.`}
            </p>
          </>
        ) : (
          <p>Please select a day from the calendar to view your sleep data.</p>
        )}
      </div>

      <div className="weekly-summary">
        <p><strong>Average Sleep (Last 7 Days):</strong> {avgSleep} hours</p>
      </div>

      <div className="sleep-chart">
        {plannedActivities.length > 0 ? (
          <Bar data={data} options={options} />
        ) : (
          <p>No sleep data available for the last 7 days.</p>
        )}
      </div>
    </div>
  );
};

export default SleepTime;
