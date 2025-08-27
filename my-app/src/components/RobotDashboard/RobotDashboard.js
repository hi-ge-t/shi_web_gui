// src/components/RobotDashboard.js
import React from "react";
import StatusBar from "../../components/StatusBar";
import CameraView from "../../views/CameraView";
import GamepadControl from "../../controls/GamepadControl";
import "./RobotDashboard.css";
import DashboardStatusSummary from "./DashboardStatusSummary";

const RobotDashboard = () => {
  return (
    <>
      {/* カメラとステータスの本体 */}
      <div className="dashboard-wrapper">
        <div className="camera-panel">
          <CameraView />
        </div>
        <div className="status-panel">
          <GamepadControl />
        </div>
      </div>
    </>
  );
};

export default RobotDashboard;
