// src/GamepadControl.js
import React, { useEffect, useState } from "react";
import ROSLIB from "roslib";
import JoystickVisualizer from "../components/JoystickVisualizer/JoystickVisualizer";

const GamepadControl = () => {
  const [connected, setConnected] = useState(false);
  const [axes, setAxes] = useState([0, 0, 0, 0]);
  const [pressedButtons, setPressedButtons] = useState({ l3: false, r3: false });
  const [prevAxes, setPrevAxes] = useState([0, 0, 0, 0]);

  const [ros, setRos] = useState(null);
  const [cmdVelTopic, setCmdVelTopic] = useState(null);

  const isDifferent = (a, b, threshold = 0.01) => {
    return Math.abs(a - b) > threshold;
  };
  
  useEffect(() => {
    const rosConnection = new ROSLIB.Ros({ url: "ws://localhost:9090" });

    rosConnection.on("connection", () => {
      console.log("ROS connected");
      setRos(rosConnection);

      const topic = new ROSLIB.Topic({
        ros: rosConnection,
        name: "/cmd_vel",
        messageType: "geometry_msgs/msg/Twist",
      });
      setCmdVelTopic(topic);
    });

    rosConnection.on("error", (error) => {
      console.error("ROS connection error:", error);
    });

    rosConnection.on("close", () => {
      console.log("ROS connection closed");
      setConnected(false);
    });

    return () => rosConnection.close();
  }, []);

  useEffect(() => {
    let hasGamepad = false;
  
    const pollGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0];
  
      if (gp) {
        //requestAnimationFrame(pollGamepad);
        if (!hasGamepad) {
          setConnected(true);
          hasGamepad = true;
        }

        const nextAxes = [gp.axes[0], gp.axes[1], gp.axes[2], gp.axes[3]];
        const xL = gp.axes[0] || 0;
        const yL = gp.axes[1] || 0;
        const xR = gp.axes[2] || 0;
        const yR = gp.axes[3] || 0;
        const l3 = gp.buttons[10]?.pressed || false;
        const r3 = gp.buttons[11]?.pressed || false;
        /*
        // 差分がある時だけsetState
        if (
          nextAxes.some((v, i) => isDifferent(v, prevAxes[i])) ||
          pressedButtons.l3 !== l3 ||
          pressedButtons.r3 !== r3
        ) {*/
          setAxes(nextAxes);
          setPrevAxes(nextAxes);
          setPressedButtons({ l3, r3 });
        //}
  
        if (cmdVelTopic) {
          const twist = new ROSLIB.Message({
            linear: { xL: -xL, yL: 0, yL: 0 },
            angular: { xL: 0, yL: 0, yL },
          });
  
          console.log("📤 Publish:", twist);
          cmdVelTopic.publish(twist);
        }
      } else {
        if (hasGamepad) {
          console.log("⛔ ゲームパッド切断");
          setConnected(false);
          hasGamepad = false;
        }
      }
  
      requestAnimationFrame(pollGamepad);
    };
  
    pollGamepad(); // ← 即起動！

    return () => {
    };
  }, [cmdVelTopic]);

  return (
    <div className="robot-status">
      <h3 className="robot-status__title">🎮 Joystick</h3>
      <div
        className="joystick-container"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem", // スティック間の間隔
          marginTop: "1rem",
        }}
      >
        <JoystickVisualizer
          x={axes[0]}
          y={axes[1]}
          type="left"
          label="Left"
          pressed={pressedButtons.l3}
        />
        <JoystickVisualizer
          x={axes[2]}
          y={axes[3]}
          type="right"
          label="Right"
          pressed={pressedButtons.r3}
        />
      </div>
    </div>
  );
};

export default GamepadControl;
