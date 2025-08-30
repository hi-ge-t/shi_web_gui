// src/views/CameraView.jsx
import React, { useState, useEffect } from "react";
import PowerBarOverlay from "../components/PowerBarOverlay/PowerBarOverlay";
import { getCameraSources } from "../lib/cameras";

import SemiGauge from "../components/SemiGauge/SemiGauge";
import GaugeModal from "../components/modals/GaugeModal";

const cameraSources = getCameraSources();

const PIX = {
  STACK_W: 320,   // スタック 幅 (QVGAの4:3)
  STACK_H: 240,   // スタック 高さ
  CENTER_MAX_W: 640, // 中央の最大幅 (= VGA)
};

// CameraView.jsx 冒頭に追加（好みで数値を変える）
const METER = {
  SIZE: 260,       // 半円の直径（横）
  GAP_V: 100,       // 縦に並ぶ2つのメーター間の間隔（スパン）
  INSET_L: 0,      // 左列を「内側(中央)へ寄せる」px（+で中央へ、-で外へ）
  INSET_R: 0,      // 右列を内側へ寄せるpx（+で中央へ、-で外へ）
  PAD_TOP: 0,      // 列全体の上余白
  PAD_BOTTOM: 0,   // 列全体の下余白
};


const CamTile = ({ src, label, active, onClick, overlay }) => {
  const hasSrc = !!src?.url;
  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full rounded-xl overflow-hidden bg-black cursor-pointer ${
        active ? "ring-2 ring-sky-500" : "ring-0"
      }`}
    >
      {hasSrc ? (
        <img
          src={src.url}
          alt={label}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover select-none"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-white/70 text-xs bg-neutral-900">
          no signal
        </div>
      )}
      {label && (
        <div className="absolute left-2 top-2 px-2 py-0.5 rounded bg-black/60 text-white text-[11px]">
          {label}
        </div>
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
    { src: cameraSources[1], labelFallback: "左 上"  }, // idx 0
    { src: cameraSources[2], labelFallback: "左 下"  }, // idx 1
    { src: cameraSources[3], labelFallback: "右 上"  }, // idx 2
    { src: cameraSources[4], labelFallback: "右 下"  }, // idx 3
  ];
  const bottomDef = { src: cameraSources[5], labelFallback: "ボトム" }; // idx 4


  // --- gauge states（例：左右×2段 = 4基）---
  const [gauges, setGauges] = useState({
    leftTop:  { currentDeg: 120, targetDeg: 120 },
    leftBot:  { currentDeg: 120, targetDeg: 120 },
    rightTop: { currentDeg: 120, targetDeg: 120 },
    rightBot: { currentDeg: 120, targetDeg: 120 },
  });
  const [modal, setModal] = useState({ open: false, key: null });

  const openGauge = (key) => setModal({ open: true, key });
  const applyGauge = (val) =>
    setGauges((g) => ({ ...g, [modal.key]: { ...g[modal.key], ...val } }));


  return (
    <div className="h-full min-h-0 flex flex-col gap-2">
      {/* 左右は固定幅、中央は残り全部。行は auto（中身の高さ＝比率箱で決まる） */}
      <div
        className="grid h-full min-h-0 gap-2"
        style={{
          gridTemplateColumns: `${PIX.STACK_W}px minmax(0,1fr) ${PIX.STACK_W}px`,
          gridTemplateRows: `auto auto`,
        }}
      >
        {/* 左スタック：240px×2段（4:3） */}
        <div
          className="grid h-full gap-2"
          style={{ gridTemplateRows: `${PIX.STACK_H}px ${PIX.STACK_H}px`, width: `${PIX.STACK_W}px` }}
        >
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

        {/* 中央：メイン（★ 4:3比率箱 + 幅上限640px） */}
        <div className="h-full flex justify-center">
          <div
            className="w-full"
            style={{
              aspectRatio: "4 / 3",
              width: `min(100%, ${PIX.CENTER_MAX_W}px)`, // ← 幅でキャップ
            }}
          >
            <CamTile
              src={cameraSources[selectedCamera]}
              label={cameraSources[selectedCamera]?.label || `Camera ${selectedCamera + 1}`}
              active
              onClick={() => {}}
              overlay={null}
            />
          </div>
        </div>

        {/* 右スタック */}
        <div
          className="grid h-full gap-2"
          style={{ gridTemplateRows: `${PIX.STACK_H}px ${PIX.STACK_H}px`, width: `${PIX.STACK_W}px` }}
        >
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

        {/* 下段：中央サブ（★ 上と同じ 4:3 + 幅上限640px） */}
        <div className="col-start-2 flex justify-center">
          <div
            className="w-full"
            style={{
              aspectRatio: "4 / 3",
              width: `min(100%, ${PIX.CENTER_MAX_W}px)`,
            }}
          >
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

        {/* ▼▼ ここが“白い空白”にメーターを置く要素 ── 2行目の左右セル ▼▼ */}
        <div
          className="col-start-1 row-start-2 flex flex-col items-center justify-center gap-6"
          style={{
            gap: METER.GAP_V,
            paddingTop: METER.PAD_TOP,
            paddingBottom: METER.PAD_BOTTOM,
            // 内側へ寄せる。右方向(中央側)にずらす
            transform: `translateX(${METER.INSET_L}px)`,
            justifyContent: "center",
          }}
        >
          <SemiGauge
            size={METER.SIZE}
            currentDeg={gauges.leftTop.currentDeg}
            targetDeg={gauges.leftTop.targetDeg}
            rotation={0}           // 断面が内向き（右）に見せたいなら 0
            label="前"
            onClick={() => openGauge("leftTop")}
          />
          <SemiGauge
            size={METER.SIZE}
            currentDeg={gauges.leftBot.currentDeg}
            targetDeg={gauges.leftBot.targetDeg}
            rotation={0}
            label="後"
            onClick={() => openGauge("leftBot")}
          />
        </div>

        <div
          className="col-start-3 row-start-2 flex flex-col items-center justify-center gap-6"
          style={{
            gap: METER.GAP_V,
            paddingTop: METER.PAD_TOP,
            paddingBottom: METER.PAD_BOTTOM,
            // 左方向(中央側)にずらす → マイナスで中央へ
            transform: `translateX(${-METER.INSET_R}px)`,
            justifyContent: "center",
          }}
        >
          <SemiGauge
            size={METER.SIZE}
            currentDeg={gauges.rightTop.currentDeg}
            targetDeg={gauges.rightTop.targetDeg}
            rotation={0}
            label="前"
            onClick={() => openGauge("rightTop")}
          />
          <SemiGauge
            size={METER.SIZE}
            currentDeg={gauges.rightBot.currentDeg}
            targetDeg={gauges.rightBot.targetDeg}
            rotation={0}
            label="後"
            onClick={() => openGauge("rightBot")}
          />
        </div>
        {/* ▲▲ ここまで ▲▲ */}

      {/* モーダル */}
      <GaugeModal
        open={modal.open}
        onClose={()=>setModal({ open:false, key:null })}
        onApply={applyGauge}
        title={`メーター設定: ${modal.key ?? ""}`}
        {...(modal.key ? gauges[modal.key] : { currentDeg:120, targetDeg:120 })}
        minDeg={0}
        maxDeg={180}
      />

      </div>
    </div>
  );
}
