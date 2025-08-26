import React from "react";

export default function BatteryCard({ percent = 100, voltage = 25.2 }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-base font-semibold mb-2">バッテリー</h3>
        <div className="text-2xl font-bold mb-1">{p}%</div>
        <div className="muted text-sm mb-3">{voltage.toFixed(1)} V</div>
        <div className="h-3 w-full rounded bg-black/20 overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${p}%` }}
            aria-label="battery-level"
          />
        </div>
      </div>
    </div>
  );
}