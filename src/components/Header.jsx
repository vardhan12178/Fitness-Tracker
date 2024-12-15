import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import "./Header.css";

const Header = ({ onPremiumClick }) => {
  const { searchQuery, setSearchQuery } = useContext(AppContext);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  return (
    <div className="header">
      <div className="greeting">
        <h1>Hello, Amigo</h1>
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
          <button
            className="clear-btn"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
      <div className="header-actions">
        <button className="premium-btn" onClick={onPremiumClick}>
          Premium
        </button>
      </div>
    </div>
  );
};

export default Header;
