import React from "react";

export default function WirelessCard({ rssi = -55, link = "Connected" }) {
  const quality = rssi > -60 ? "良好" : rssi > -75 ? "普通" : "不安定";
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="text-base font-semibold mb-2">無線リンク</h3>
        <div className="font-medium mb-1">{link}</div>
        <div className="muted text-sm">RSSI: {rssi} dBm（{quality}）</div>
      </div>
    </div>
  );
}