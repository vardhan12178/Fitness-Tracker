import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./SleepTime.css";


ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SleepTime = () => {
  const { plannedActivities, goals, selectedDay } = useContext(AppContext);


  const activitiesForDay = plannedActivities.filter(
    (activity) => new Date(activity.date).getDate() === selectedDay
  );

  const totalSleep = activitiesForDay.reduce((acc, activity) => acc + Number(activity.sleep || 0), 0);


  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  });

  const sleepData = last7Days.map((day) => {
    const activity = plannedActivities.find((activity) => activity.date === day);
    return {
      date: new Date(day).toLocaleDateString(),
      sleep: activity ? Number(activity.sleep || 0) : 0,
    };
  });


  const data = {
    labels: sleepData.map((d) => d.date), 
    datasets: [
      {
        label: "Sleep Hours",
        data: sleepData.map((d) => d.sleep), 
        backgroundColor: "#4caf50",
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
      },
    },
  };

  return (
    <div className="sleep-time">
      <h2>Sleep Tracker</h2>
      <div className="sleep-summary">
        {selectedDay ? (
          <>
            <p><strong>Selected Day:</strong> {selectedDay}</p>
            <p><strong>Total Sleep:</strong> {totalSleep} hours</p>
            <p className={totalSleep >= goals.sleepHours ? "goal-achieved" : "goal-missed"}>
              {totalSleep >= goals.sleepHours
                ? "Great job! You've met your sleep goal."
                : `You slept ${goals.sleepHours - totalSleep} hours less than your goal.`}
            </p>
          </>
        ) : (
          <p>Please select a day from the calendar to view your sleep data.</p>
        )}
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
