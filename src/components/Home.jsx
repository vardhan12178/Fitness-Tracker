import React, { useContext } from "react";
import PhysicalActivity from "./PhysicalActivity";
import Calendar from "./Calendar";
import SleepTime from "./SleepTime";
import WeightLossPlan from "./WeightLossPlan";
import MyActivities from "./MyActivities";
import GoalsSection from "./GoalsSection";
import Planner from "./Planner";
import DailyInsights from "./DailyInsights";
import { AppContext } from "../AppContext";
import "./Home.css";

const Home = ({ searchQuery }) => {
  const { selectedDay } = useContext(AppContext);
  console.log(selectedDay);

  return (
    <div className="dashboard">
      
      <div className="row top-row">
        <div className="physical-activity-container">
          <PhysicalActivity />
        </div>
        <div className="side-column">
          <DailyInsights />
          <Calendar />
        </div>
      </div>

     
      <div className="row middle-row">
        <SleepTime />
        <WeightLossPlan />
        <MyActivities searchQuery={searchQuery} />
      </div>

      <div className="row bottom-row">
        <Planner />
        <GoalsSection />
      </div>
    </div>
  );
};

export default Home;
