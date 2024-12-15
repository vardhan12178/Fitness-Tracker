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
      <NavLink to="/" className="icon" activeClassName="active">
        <FaHome />
        <span>Home</span>
      </NavLink>
      <NavLink to="/goals" className="icon" activeClassName="active">
        <FaBullseye />
        <span>Goals</span>
      </NavLink>
      <NavLink to="/planner" className="icon" activeClassName="active">
        <FaCalendarPlus />
        <span>Planner</span>
      </NavLink>
      <NavLink to="/calendar" className="icon" activeClassName="active">
        <FaCalendarAlt />
        <span>Calendar</span>
      </NavLink>
      <NavLink to="/weight-loss" className="icon" activeClassName="active">
        <FaChartLine />
        <span>Weight</span>
      </NavLink>
      <NavLink to="/my-activities" className="icon" activeClassName="active">
        <FaUser />
        <span>Activities</span>
      </NavLink>
      <NavLink to="/goal-progress" className="icon" activeClassName="active">
        <FaCheckCircle />
        <span>Progress</span>
      </NavLink>
      <NavLink to="/nutrition" className="icon" activeClassName="active">
        <FaUtensils />
        <span>Nutrition</span>
      </NavLink>
      <NavLink to="/social-sharing" className="icon" activeClassName="active">
        <FaShareSquare />
        <span>Share</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
