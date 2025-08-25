// src/App.js
import React from "react";
import RobotControl from "./components/RobotDashboard/RobotDashboard";
import Settings from "./components/Settings/Settings";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import RobotStatusProvider from "./providers/RobotStatusProvider";
import "./styles/global.css";

function App() {
  return (
    <RobotStatusProvider>
      <div className="app-container">
        <div className="top-right-buttons">
          <Settings />
          <ThemeToggle />
        </div>
        <RobotControl />
      </div>
    </RobotStatusProvider>
  );
}

export default App;
