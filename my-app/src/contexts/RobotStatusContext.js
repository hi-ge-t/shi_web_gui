import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const RobotStatusContext = createContext(null);

export const useRobotStatus = () => useContext(RobotStatusContext);

export const MockRobotStatusProvider = ({ children, tick = false }) => {
  const [status, setStatus] = useState({
    battery: 95,
    temperature: 42,
    network: "接続中",
    rosStatus: "接続中",
    gamepadConnected: true,
    fps: 30,
  });

  useEffect(() => {
    if (!tick) return;
    const id = setInterval(() => {
      setStatus((s) => ({
        ...s,
        battery: Math.max(0, Math.min(100, s.battery - 0.05)),
        fps: Math.max(0, Math.min(60, s.fps + (Math.random() - 0.5) * 2)),
      }));
    }, 1000);
    return () => clearInterval(id);
  }, [tick]);

  const value = useMemo(() => status, [status]);

  return (
    <RobotStatusContext.Provider value={value}>
      {children}
    </RobotStatusContext.Provider>
  );
};
