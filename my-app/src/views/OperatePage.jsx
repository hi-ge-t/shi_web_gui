import React from "react";
import RobotControl from "../components/RobotDashboard/RobotDashboard";

export default function OperatePage() {
  // 既存の操作UI（カメラ6分割・E-STOP 等）をそのまま使用
  return (
    <div className="dashboard-wrapper dashboard-embedded">
      <RobotControl />;
    </div>
  );
}