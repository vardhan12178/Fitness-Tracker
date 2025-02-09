import React, { useState } from "react";
import "./PremiumSection.css";

const PremiumSection = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-icon" onClick={onClose}>✖</button>

        <h2>Unlock Premium Features</h2>
        <p>Gain access to exclusive features and take your progress to the next level!</p>


        <div className="plans">
          <button
            className={`plan-btn ${selectedPlan === "basic" ? "selected" : ""}`}
            onClick={() => setSelectedPlan("basic")}
          >
            Basic
          </button>
          <button
            className={`plan-btn ${selectedPlan === "pro" ? "selected" : ""}`}
            onClick={() => setSelectedPlan("pro")}
          >
            Pro
          </button>
          <button
            className={`plan-btn ${selectedPlan === "ultimate" ? "selected" : ""}`}
            onClick={() => setSelectedPlan("ultimate")}
          >
            Ultimate
          </button>
        </div>

        <div className="plan-details">
          {selectedPlan === "basic" && (
            <ul>
              <li>✔ Basic Activity Tracking</li>
              <li>✔ Limited Goal Suggestions</li>
              <li>❌ No Priority Support</li>
            </ul>
          )}
          {selectedPlan === "pro" && (
            <ul>
              <li>✔ Advanced Analytics</li>
              <li>✔ Personalized Recommendations</li>
              <li>✔ Email Support</li>
            </ul>
          )}
          {selectedPlan === "ultimate" && (
            <ul>
              <li>✔ All Pro Features</li>
              <li>✔ 1-on-1 Coaching</li>
              <li>✔ 24/7 Priority Support</li>
            </ul>
          )}
        </div>

        <button className="upgrade-btn">Upgrade Now</button>
      </div>
    </div>
  );
};

export default PremiumSection;
