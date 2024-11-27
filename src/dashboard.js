import React from "react";
import "./dashboard.css";

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard">
      <h1>Welcome to the Dashboard</h1>
      <p>Logged in as: {user?.email || "Unknown User"}</p>
      <div className="dashboard-content">
        <p>This is a placeholder dashboard. Add your functionality here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
