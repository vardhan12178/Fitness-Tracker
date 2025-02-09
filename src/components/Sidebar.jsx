import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBullseye,
  FaCalendarPlus,
  FaCalendarAlt,
  FaChartLine,
  FaUser,
  FaCheckCircle,
  FaUtensils,
  FaShareSquare,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaHome />
        <span>Home</span>
      </NavLink>
      <NavLink to="/goals" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaBullseye />
        <span>Goals</span>
      </NavLink>
      <NavLink to="/planner" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaCalendarPlus />
        <span>Planner</span>
      </NavLink>
      <NavLink to="/calendar" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaCalendarAlt />
        <span>Calendar</span>
      </NavLink>
      <NavLink to="/weight-loss" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaChartLine />
        <span>Weight</span>
      </NavLink>
      <NavLink to="/my-activities" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaUser />
        <span>Activities</span>
      </NavLink>
      <NavLink to="/goal-progress" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaCheckCircle />
        <span>Progress</span>
      </NavLink>
      <NavLink to="/nutrition" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaUtensils />
        <span>Nutrition</span>
      </NavLink>
      <NavLink to="/social-sharing" className={({ isActive }) => (isActive ? "icon active" : "icon")}>
        <FaShareSquare />
        <span>Share</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
