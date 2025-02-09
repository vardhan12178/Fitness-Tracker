import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import Slider from "react-slick";
import { FaDumbbell, FaWalking, FaFire, FaBed, FaWeight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MyActivities.css";

const MyActivities = () => {
  const { plannedActivities, selectedDay } = useContext(AppContext);

  if (!selectedDay) {
    return <p className="no-activities">📅 Please select a day from the calendar.</p>;
  }

  const filteredActivities = plannedActivities.filter((activity) => {
    const activityDate = new Date(activity.date).toDateString();
    const selectedDateFormatted = new Date(new Date().setDate(selectedDay)).toDateString();
    return activityDate === selectedDateFormatted;
  });

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="my-activities">
      <h2>My Activities</h2>
      {filteredActivities.length > 0 ? (
        <Slider {...settings}>
          {filteredActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <h3>{activity.activity}</h3>
              <div className="activity-details">
                <p><FaWalking className="icon" /> <strong>Steps:</strong> {activity.steps}</p>
                <p><FaFire className="icon" /> <strong>Calories:</strong> {activity.calories} kcal</p>
                <p><FaBed className="icon" /> <strong>Hours Slept:</strong> {activity.sleep} hrs</p>
                <p><FaWeight className="icon" /> <strong>Weight:</strong> {activity.currentWeight} kg</p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="no-activities">No activities planned for this day.</p>
      )}
    </div>
  );
};

export default MyActivities;
