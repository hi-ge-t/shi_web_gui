// src/components/RobotDashboard/DashboardHeader.js
import React from "react";
import { useRobotStatus } from "../../contexts/RobotStatusContext";
import "./RobotDashboard.css"; // スタイル共用

const DashboardHeader = () => {
  const { rosStatus, gamepadConnected } = useRobotStatus();

  return (
    <div className="dashboard-header">
      <h1 className="dashboard-title">SHI Robot Controller</h1>
    </div>
  );
};

export default DashboardHeader;
