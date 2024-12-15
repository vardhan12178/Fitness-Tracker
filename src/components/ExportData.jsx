import React from "react";
import "./ExportData.css";

const ExportData = ({ data }) => {
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fitness_data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-data">
      <button className="export-btn" onClick={handleExport}>
        Export Data
      </button>
    </div>
  );
};

export default ExportData;
