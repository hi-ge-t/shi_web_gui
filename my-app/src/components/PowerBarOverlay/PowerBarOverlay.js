// src/components/PowerBarOverlay.js
import React, { useEffect, useRef } from "react";
import { animateBar } from "./animateBar";
import "./PowerBarOverlay.css";

const PowerBarOverlay = ({ sensorPower = 0, motorPower = 0 }) => {
  const sensorRef = useRef(null);
  const motorRef = useRef(null);

  useEffect(() => {
    animateBar(sensorRef, sensorPower, {
      low: "#1de9b6",
      mid: "#00e676",
      high: "#00ff99"
    });

    animateBar(motorRef, motorPower, {
      low: "#f06292",
      mid: "#ec407a",
      high: "#ff1744"
    });
  }, [sensorPower, motorPower]);

  return (
    <div className="power-bar-container">
      <div className="power-bar sensor">
        <div className="power-bar-fill" ref={sensorRef}></div>
      </div>
      <div className="power-bar motor">
        <div className="power-bar-fill" ref={motorRef}></div>
      </div>
    </div>
  );
};

export default PowerBarOverlay;
