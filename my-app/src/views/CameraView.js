import React, { useState, useEffect } from "react";
import PowerBarOverlay from "../components/PowerBarOverlay/PowerBarOverlay";
import { getCameraSources } from "../lib/cameras";

const cameraSources = getCameraSources();

const CamTile = ({ src, label, active, onClick, overlay }) => {
  const hasSrc = !!src?.url;
  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full rounded-xl overflow-hidden bg-black cursor-pointer
                  ${active ? "ring-2 ring-sky-500" : "ring-0"}`}
    >
      {hasSrc ? (
        <img src={src.url} alt={label} draggable={false} className="w-full h-full object-cover select-none" />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-white/70 text-xs bg-neutral-900">no signal</div>
      )}
      {label && (
        <div className="absolute left-2 top-2 px-2 py-0.5 rounded bg-black/60 text-white text-[11px]">{label}</div>
      )}
      <div className="absolute left-1.5 bottom-1.5 pointer-events-none">{overlay}</div>
    </div>
  );
};

export default function CameraView() {
  const [selectedCamera, setSelectedCamera] = useState(0);
  const SLOT_COUNT = 5;
  const [powerData, setPowerData] = useState(Array(SLOT_COUNT).fill([0.5, 0.5]));

  useEffect(() => {
    const id = setInterval(() => {
      setPowerData((prev) => prev.map(() => [Math.random(), Math.random()]));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const slotDefs = [
    { src: cameraSources[1], labelFallback: "左 上"  }, // power idx 0
    { src: cameraSources[2], labelFallback: "左 下"  }, // power idx 1
    { src: cameraSources[3], labelFallback: "右 上"  }, // power idx 2
    { src: cameraSources[4], labelFallback: "右 下"  }, // power idx 3
  ];
  const bottomDef = { src: cameraSources[5], labelFallback: "ボトム" }; // power idx 4

  return (
    // 親から高さを受け取ってフルで使う
    <div className="h-full min-h-0 flex flex-col gap-3">
      {/* 3カラム×2行。行は 1fr / 1fr で等分 → メインとサブが同じ高さになる */}
      <div className="grid h-full min-h-0 grid-cols-[1fr_1.25fr_1fr] grid-rows-[1fr_1fr] gap-3">
        {/* 1行目：左スタック */}
        <div className="grid grid-rows-2 gap-3 h-full">
          {[0, 1].map((i) => (
            <CamTile
              key={`lt-${i}`}
              src={slotDefs[i].src}
              label={slotDefs[i].src?.label || slotDefs[i].labelFallback}
              active={selectedCamera === i + 1}
              onClick={() => setSelectedCamera(i + 1)}
              overlay={
                <PowerBarOverlay
                  sensorPower={powerData[i]?.[0] ?? 0}
                  motorPower={powerData[i]?.[1] ?? 0}
                />
              }
            />
          ))}
        </div>

        {/* 1行目：中央メイン（行の高さを100%使用） */}
        <div className="h-full">
          <CamTile
            src={cameraSources[selectedCamera]}
            label={cameraSources[selectedCamera]?.label || `Camera ${selectedCamera + 1}`}
            active
            onClick={() => {}}
            overlay={null}
          />
        </div>

        {/* 1行目：右スタック */}
        <div className="grid grid-rows-2 gap-3 h-full">
          {[2, 3].map((i) => (
            <CamTile
              key={`rt-${i}`}
              src={slotDefs[i].src}
              label={slotDefs[i].src?.label || slotDefs[i].labelFallback}
              active={selectedCamera === i + 1}
              onClick={() => setSelectedCamera(i + 1)}
              overlay={
                <PowerBarOverlay
                  sensorPower={powerData[i]?.[0] ?? 0}
                  motorPower={powerData[i]?.[1] ?? 0}
                />
              }
            />
          ))}
        </div>

        {/* 2行目：中央だけサブ（メインと同じ行高・同じ幅） */}
        <div className="col-start-2 row-start-2 h-full">
          <CamTile
            src={bottomDef.src}
            label={bottomDef.src?.label || bottomDef.labelFallback}
            active={selectedCamera === 5}
            onClick={() => setSelectedCamera(5)}
            overlay={
              <PowerBarOverlay
                sensorPower={powerData[4]?.[0] ?? 0}
                motorPower={powerData[4]?.[1] ?? 0}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
