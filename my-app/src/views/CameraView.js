// src/views/CameraView.js
import React, { useState, useEffect } from "react";
import "./CameraView.css";
import PowerBarOverlay from "../components/PowerBarOverlay/PowerBarOverlay";

const cameraSources = [
  {
    url: "/camera_sample/top_vga.jpg",
    label: "俯瞰"
  },
  {
    url: "/camera_sample/tire_side_in_qvga.jpg",
    label: "左前"
  },
  {
    url: "/camera_sample/tire_side_in_qvga.jpg",
    label: "左後"
  },
  {
    url: "/camera_sample/tire_side_in_qvga.jpg",
    label: "右前"
  },
  {
    url: "/camera_sample/tire_side_in_qvga.jpg",
    label: "左後"
  },
  {
    url: "https://fakeimg.pl/600x400/0022ff,128/ffffff?text=Camera6",
    label: "サブ"
  }
];

const CameraView = () => {
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [powerData, setPowerData] = useState(
    Array(4).fill([0.5, 0.5]) // 0.0〜1.0 の初期値
  );

  // ダミーデータ：それぞれのカメラに対応する2本のバー値（0〜100）
  // 10Hzでランダムな電力を更新
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = powerData.map(() => [
        Math.random(), // sensor power
        Math.random()  // motor power
      ]);
      setPowerData(newData);
    }, 1000); // 100ms = 10Hz

    return () => clearInterval(interval);
  }, []);


  return (
    <div>
      {/* メインカメラ */}
      <div className="main-camera relative">
        <img
          src={cameraSources[selectedCamera].url}
          alt={`Camera ${selectedCamera + 1}`}
          className="main-camera-image"
        />
        <div className="camera-label">
          {cameraSources[selectedCamera].label}
        </div>
      </div>

      {/* サブカメラ（4つ横並び） */}
      <div className="sub-cameras">
        {cameraSources.slice(1, 5).map((cam, index) => {
          const cameraIndex = index + 1;
          const isActive = selectedCamera === cameraIndex;
          const [sensorPower, motorPower] = powerData[index];

          return (
            <div key={index} className="camera-thumbnail-wrapper">
              <img
                src={cam.url}
                alt={`Camera ${index + 2}`}
                className={`sub-camera-image ${
                  selectedCamera === index + 1 ? "active" : ""
                }`}
                onClick={() => setSelectedCamera(index + 1)}
              />
              <div className="camera-label">{cam.label}</div>

              {/* ✅ PowerBarOverlayを呼び出す */}
              <PowerBarOverlay
                sensorPower={sensorPower}
                motorPower={motorPower}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CameraView;