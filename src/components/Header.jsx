import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../AppContext";
import { FaMicrophone, FaTimes, FaBell } from "react-icons/fa";
import "./Header.css";

const Header = ({ onPremiumClick }) => {
  const { searchQuery, setSearchQuery, reminders } = useContext(AppContext);
  const [greeting, setGreeting] = useState("Hello, Amigo");
  const [isListening, setIsListening] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning! ☀️");
    } else if (hours < 18) {
      setGreeting("Good Afternoon! 🌤️");
    } else {
      setGreeting("Good Evening! 🌙");
    }
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const toggleReminders = () => {
    setShowReminders(!showReminders);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowReminders(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="greeting">
        <h1>{greeting}</h1>
        <p>Ready for today’s challenges?</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for activities or goals"
          onChange={handleSearch}
          value={searchQuery}
          aria-label="Search activities and goals"
        />
        {searchQuery && (
          <button className="clear-btn" onClick={() => setSearchQuery("")} aria-label="Clear search">
            <FaTimes />
          </button>
        )}
        <button className={`mic-btn ${isListening ? "listening" : ""}`} onClick={startListening} aria-label="Voice search">
          <FaMicrophone />
        </button>
      </div>

      <div className="header-actions">
        <div className="action-buttons">
          <div ref={bellRef} className="notification-container">
            <button
              className={`notification-bell ${reminders?.length > 0 ? "has-reminders" : ""}`}
              onClick={toggleReminders}
              aria-label="View notifications"
            >
              <FaBell />
              {reminders?.length > 0 && <span className="reminder-dot"></span>}
            </button>

            {showReminders && (
              <div className="reminder-dropdown">
                <h4>Reminders</h4>
                {reminders?.length > 0 ? (
                  <ul>
                    {reminders.map((reminder, index) => (
                      <li key={index}>{reminder}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No new reminders.</p>
                )}
              </div>
            )}
          </div>

          <button className="premium-btn" onClick={onPremiumClick}>
            Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
