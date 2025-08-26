import React from "react";

export default function HeartbeatCard({ alive = true, latencyMs = 32 }) {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-base font-semibold mb-2">ハートビート</h3>
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              alive ? "bg-green-400" : "bg-red-500"
            }`}
          />
          <span className="font-medium">{alive ? "受信中" : "停止"}</span>
        </div>
        <div className="muted text-sm mt-2">遅延: {latencyMs} ms</div>
      </div>
    </div>
  );
}