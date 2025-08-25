// src/components/RobotDashboard.js
import React from "react";
import CameraView from "../../views/CameraView";
import RobotStatusView from "../../views/RobotStatusView";
import GamepadControl from "../../controls/GamepadControl";
import DashboardHeader from "./DashboardHeader";
import "./RobotDashboard.css";
import DashboardStatusSummary from "./DashboardStatusSummary";

const RobotDashboard = () => {
  return (
    <>
      {/* タイトルと設定ボタン：固定表示 */}
      <DashboardHeader />
      <DashboardStatusSummary />

      {/* カメラとステータスの本体 */}
      <div className="dashboard-wrapper">
        <div className="camera-panel">
          <CameraView />
        </div>
        <div className="status-panel">
          <RobotStatusView />
          <GamepadControl />
        </div>
      </div>
    </>
  );
};

export default RobotDashboard;
