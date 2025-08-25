// src/views/RobotStatusView.js
import React from "react";
import { useRobotStatus } from "../contexts/RobotStatusContext";
import "./RobotStatusView.css";

const RobotStatusView = () => {
  const { battery, temperature, network, rosStatus, gamepadConnected, fps } = useRobotStatus();

  return (
    <div className="robot-status">
      <h2 className="robot-status__title">🤖 Robot Status</h2>
      <div className="robot-status__table">
        <div className="robot-status__label">🔋 Battery</div>
        <div className="robot-status__value">{battery}%</div>

        <div className="robot-status__table">🌡️ Temp</div>
        <div className="robot-status__value">{temperature}°C</div>
        
        <div className="robot-status__table">📡 Network</div>
        <div className="robot-status__value">{network}</div>
        
        <div className="robot-status__table">📡 ROS</div>
        <div className="robot-status__value">{rosStatus === "接続中" ? "🟢 接続中" : "🔴 切断中"}</div>
        
        <div className="robot-status__table">🎮 Gamepad</div>
        <div className="robot-status__value">{gamepadConnected ? "🟢 接続中" : "🔴 未接続"}</div>
        
        <div className="robot-status__table">⚡ FPS</div>
        <div className="robot-status__value">{fps}</div>
      </div>
    </div>
  );
};

export default RobotStatusView;
