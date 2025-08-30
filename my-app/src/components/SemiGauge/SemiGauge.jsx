import React from "react";

export default function SemiGauge({
  size = 160,
  currentDeg = 120,
  targetDeg = 120,
  minDeg = 0,
  maxDeg = 180,
  rotation = 0, // 見た目の回転（deg）。例：右側で“断面が内向き”にしたいなら 0、上向きなら -90 等
  label,
  onClick,
}) {
  const W = 100;         // 内部座標（横）
  const H = 50;          // 内部座標（縦 = 半分）
  const cx = W / 2;
  const cy = H;          // 底辺中心

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const toRad = (deg) => (deg - 180) * (Math.PI / 180); // 0..180 -> 半円（左→右）

  const normCur = clamp(currentDeg, minDeg, maxDeg);
  const normTgt = clamp(targetDeg,  minDeg, maxDeg);

  const angleToXY = (deg, r) => {
    const rad = toRad(deg);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // 背景アーク
  const R = 48;
  const arcPath = `M ${cx - R},${cy} A ${R},${R} 0 0 1 ${cx + R},${cy}`;

  // 針
  const curP = angleToXY(normCur, R - 6);
  const tgtP = angleToXY(normTgt, R - 6);

  // 目盛（任意：30°刻み）
  const ticks = [];
  for (let d = 0; d <= 180; d += 30) {
    const outer = angleToXY(d, R);
    const inner = angleToXY(d, R - 5);
    ticks.push(<line key={d} x1={outer.x} y1={outer.y} x2={inner.x} y2={inner.y} stroke="currentColor" strokeWidth="1" opacity="0.6" />);
  }

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size / 2, transform: `rotate(${rotation}deg)` }}
      onClick={onClick}
      role="button"
    >
      <svg viewBox="0 0 100 50" width="100%" height="100%">
        {/* 背景 */}
        <path d={arcPath} fill="none" stroke="currentColor" strokeWidth="6" opacity="0.25" />
        {ticks}
        {/* 針（現在＝太／目標＝細） */}
        <line x1={cx} y1={cy} x2={curP.x} y2={curP.y} stroke="turquoise" strokeWidth="3.5" />
        <circle cx={curP.x} cy={curP.y} r="1.8" fill="turquoise" />
        <line x1={cx} y1={cy} x2={tgtP.x} y2={tgtP.y} stroke="deeppink" strokeWidth="2" />
        {/* ハブ */}
        <circle cx={cx} cy={cy} r="3" fill="black" stroke="white" strokeWidth="1" />
      </svg>
      {label && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-neutral-500">
          {label} <span className="ml-1 text-neutral-400">{Math.round(currentDeg)}°</span>
        </div>
      )}
    </div>
  );
}
