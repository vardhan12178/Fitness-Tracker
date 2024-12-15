import React from "react";
import "./PremiumSection.css";

const PremiumSection = ({ onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Premium Features</h2>
        <p>Unlock advanced tracking and personalized goals with our premium subscription!</p>
        <ul>
          <li>Advanced analytics for your activities</li>
          <li>Personalized recommendations</li>
          <li>Priority support</li>
        </ul>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default PremiumSection;
