import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppProvider from "./AppContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PremiumSection from "./components/PremiumSection";
import Home from "./components/Home";
import GoalsSection from "./components/GoalsSection";
import Planner from "./components/Planner";
import Calendar from "./components/Calendar";
import SleepTime from "./components/SleepTime";
import WeightLossPlan from "./components/WeightLossPlan";
import MyActivities from "./components/MyActivities";
import GoalProgress from "./components/GoalProgress";
import Nutrition from "./components/Nutrition";
import SocialSharing from "./components/SocialSharing";
import Reminder from "./components/Reminder";
import Badges from "./components/Badges";
import Footer from "./components/Footer"; 
import "./App.css";
import "./components/Header.css";
import "./components/Sidebar.css";
import "./components/GoalProgress.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const togglePremiumModal = () => {
    setIsPremiumModalOpen(!isPremiumModalOpen);
  };

  return (
    <AppProvider>
      <Reminder />
      <Router>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header
              onSearch={setSearchQuery}
              onPremiumClick={togglePremiumModal}
            />
            {isPremiumModalOpen && <PremiumSection onClose={togglePremiumModal} />}
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/goals" element={<GoalsSection />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/sleep-time" element={<SleepTime />} />
              <Route path="/weight-loss" element={<WeightLossPlan />} />
              <Route
                path="/my-activities"
                element={<MyActivities searchQuery={searchQuery} />}
              />
              <Route path="/goal-progress" element={<GoalProgress />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/social-sharing" element={<SocialSharing />} />
              <Route path="/badges" element={<Badges milestones={[]} />} />
            </Routes>
            <Footer /> 
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
