// src/providers/RobotStatusProvider.js
import React, { useState, useEffect } from "react";
import ROSLIB from "roslib";
import RobotStatusContext from "../contexts/RobotStatusContext";

const RobotStatusProvider = ({ children }) => {
  const [battery, setBattery] = useState(100);
  const [temperature, setTemperature] = useState(30);
  const [network, setNetwork] = useState("Disconnected");
  const [rosStatus, setRosStatus] = useState("切断中");
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: "ws://localhost:9090" });

    ros.on("connection", () => {
      setNetwork("Connected");
      setRosStatus("接続中");
    });

    ros.on("error", () => {
      setNetwork("Disconnected");
      setRosStatus("切断中");
    });

    const batteryListener = new ROSLIB.Topic({
      ros,
      name: "/battery",
      messageType: "std_msgs/Float32",
    });
    batteryListener.subscribe((msg) => setBattery(msg.data));

    const tempListener = new ROSLIB.Topic({
      ros,
      name: "/temperature",
      messageType: "std_msgs/Float32",
    });
    tempListener.subscribe((msg) => setTemperature(msg.data));

    window.addEventListener("gamepadconnected", () => setGamepadConnected(true));
    window.addEventListener("gamepaddisconnected", () => setGamepadConnected(false));

    // FPSカウント
    let frameCount = 0;
    let lastTime = performance.now();

    const countFPS = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(countFPS);
    };
    countFPS();

    return () => {
      batteryListener.unsubscribe();
      tempListener.unsubscribe();
      ros.close();
    };
  }, []);

  return (
    <RobotStatusContext.Provider
      value={{
        battery,
        temperature,
        network,
        rosStatus,
        gamepadConnected,
        fps,
      }}
    >
      {children}
    </RobotStatusContext.Provider>
  );
};

export default RobotStatusProvider;
