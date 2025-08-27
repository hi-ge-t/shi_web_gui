import React, { useState, useEffect } from "react";
import "./CameraView.css";
import PowerBarOverlay from "../components/PowerBarOverlay/PowerBarOverlay";
import { getCameraSources } from "../lib/cameras";

const cameraSources = getCameraSources();

/**
 * 想定スロット:
 *  - main:          選択中のカメラ (selectedCamera)
 *  - leftTop:       sources[1]
 *  - leftBottom:    sources[2]
 *  - rightTop:      sources[3]
 *  - rightBottom:   sources[4]
 *  - bottomMain:    sources[5]
 * ※足りない場合は undefined を受け取り "no signal" 表示
 */
const CameraView = () => {
  const [selectedCamera, setSelectedCamera] = useState(0);

  // 2本バー(センサ/モータ)用ダミー：左2 + 右2 + 下1 = 5スロットぶん
  const SLOT_COUNT = 5;
  const [powerData, setPowerData] = useState(
    Array(SLOT_COUNT).fill([0.5, 0.5])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // 閉包の古いstateを避けるため関数更新
      setPowerData(prev =>
        prev.map(() => [Math.random(), Math.random()])
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const slotDefs = [
    { key: "leftTop",    src: cameraSources[1], powerIndex: 0, clickIndex: 1, labelFallback: "左 上" },
    { key: "leftBottom", src: cameraSources[2], powerIndex: 1, clickIndex: 2, labelFallback: "左 下" },
    { key: "rightTop",   src: cameraSources[3], powerIndex: 2, clickIndex: 3, labelFallback: "右 上" },
    { key: "rightBottom",src: cameraSources[4], powerIndex: 3, clickIndex: 4, labelFallback: "右 下" },
  ];
  const bottomDef = {
    key: "bottomMain", src: cameraSources[5], powerIndex: 4, clickIndex: 5, labelFallback: "ボトム"
  };

  const renderTile = ({ src, label, onClick, active, powerIndex, className }) => {
    const [sensorPower, motorPower] = powerData[powerIndex] || [0, 0];
    const hasSrc = !!src?.url;

    return (
      <div className={`cv-tile ${className || ""} ${active ? "cv-active" : ""}`} onClick={onClick}>
        {hasSrc ? (
          <img src={src.url} alt={label} className="cv-img" draggable={false} />
        ) : (
          <div className="cv-nosignal">no signal</div>
        )}
        <div className="cv-label">{label}</div>
        <div className="cv-overlay">
          <PowerBarOverlay sensorPower={sensorPower} motorPower={motorPower} />
        </div>
      </div>
    );
  };

  return (
    <div className="cv-root">
      <div className="cv-grid">
        {/* 1行目：左/メイン/右 */}
        <div className="cv-stack cv-left">
          {renderTile({ /* 左上 */  src: slotDefs[0].src, label: slotDefs[0].src?.label || slotDefs[0].labelFallback,
            onClick: () => setSelectedCamera(slotDefs[0].clickIndex), active: selectedCamera === slotDefs[0].clickIndex,
            powerIndex: slotDefs[0].powerIndex, className: "cv-stackcell" })}
          {renderTile({ /* 左下 */  src: slotDefs[1].src, label: slotDefs[1].src?.label || slotDefs[1].labelFallback,
            onClick: () => setSelectedCamera(slotDefs[1].clickIndex), active: selectedCamera === slotDefs[1].clickIndex,
            powerIndex: slotDefs[1].powerIndex, className: "cv-stackcell" })}
        </div>

        <div className="cv-main">
          <div className="cv-tile cv-maininner cv-active">
            <img src={cameraSources[selectedCamera]?.url}
                alt={cameraSources[selectedCamera]?.label || `Camera ${selectedCamera + 1}`}
                className="cv-img" draggable={false} />
            <div className="cv-label cv-label--main">
              {cameraSources[selectedCamera]?.label || `Camera ${selectedCamera + 1}`}
            </div>
          </div>
        </div>

        <div className="cv-stack cv-right">
          {renderTile({ /* 右上 */  src: slotDefs[2].src, label: slotDefs[2].src?.label || slotDefs[2].labelFallback,
            onClick: () => setSelectedCamera(slotDefs[2].clickIndex), active: selectedCamera === slotDefs[2].clickIndex,
            powerIndex: slotDefs[2].powerIndex, className: "cv-stackcell" })}
          {renderTile({ /* 右下 */  src: slotDefs[3].src, label: slotDefs[3].src?.label || slotDefs[3].labelFallback,
            onClick: () => setSelectedCamera(slotDefs[3].clickIndex), active: selectedCamera === slotDefs[3].clickIndex,
            powerIndex: slotDefs[3].powerIndex, className: "cv-stackcell" })}
        </div>

        {/* 2行目：中央だけ“サブ”を配置（幅＝中央カラムと完全一致） */}
        <div className="cv-sub">
          {renderTile({
            src: bottomDef.src,
            label: bottomDef.src?.label || bottomDef.labelFallback,
            onClick: () => setSelectedCamera(bottomDef.clickIndex),
            active: selectedCamera === bottomDef.clickIndex,
            powerIndex: bottomDef.powerIndex,
            className: "cv-bottomcell"
          })}
        </div>
      </div>
    </div>
  );
}

export default CameraView;
