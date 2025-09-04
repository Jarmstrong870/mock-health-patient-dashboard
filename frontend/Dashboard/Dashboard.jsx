import React from "react";
import "./Dashboard.css";

function Dashboard({ username }) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome, {username || "Staff Member"} 👋</h2>
        <p className="dashboard-subtext">
          You are now logged in to the staff dashboard.
        </p>

        <div className="dashboard-content">
          <div className="dashboard-box">📊 Stats / Charts (placeholder)</div>
          <div className="dashboard-box">📂 Patient Records (placeholder)</div>
          <div className="dashboard-box">⚙️ Settings (placeholder)</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
