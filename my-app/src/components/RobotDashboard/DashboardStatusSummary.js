// src/components/RobotDashboard/DashboardStatusSummary.js
import React from "react";
import { useRobotStatus } from "../../contexts/RobotStatusContext";
import "./DashboardStatusSummary.css";

const DashboardStatusSummary = () => {
  const { battery, temperature, network, rosStatus, gamepadConnected, fps } = useRobotStatus();

  const items = [
    { label: "🔋 Battery", value: `${battery}%` },
    { label: "🌡️ Temp", value: `${temperature}°C` },
    { label: "📡 Network", value: network },
    { label: "🧠 ROS", value: rosStatus },
    { label: "🎮 Gamepad", value: gamepadConnected ? "Connected" : "Disconnected" },
    { label: "⚡ FPS", value: fps },
  ];

  return (
    <div className="dashboard-status-summary">
      {items.map(({ label, value }, index) => (
        <div className="status-summary-item" key={index}>
          <span className="status-label">{label}</span>
          <span className="status-value">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatusSummary;
