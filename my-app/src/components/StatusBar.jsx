// ./src/components/StatusBar.jsx
import React from "react";
import { useRobotStatus } from "../contexts/RobotStatusContext";

const Item = ({ icon, label, value, ok = true }) => (
  <div className="flex items-center gap-2 px-3 py-1">
    <span className="text-lg">{icon}</span>
    <span className="text-xs opacity-80">{label}:</span>
    <span className={`text-sm font-semibold ${ok ? "text-green-400" : "text-red-400"}`}>
      {value}
    </span>
  </div>
);

export default function StatusBar() {
  const ctx = useRobotStatus?.();
  if (!ctx) {
    // Provider未接続や初期化前は安全にスケルトン表示
    return (
      <div className="h-[60px] bg-neutral-900 text-white flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center text-yellow-300 text-sm">Robot status unavailable</div>
      </div>
    );
  }
  
  const { battery, temperature, network, rosStatus, gamepadConnected, fps } = ctx;

  return (
    <div
      className="
        h-[60px] bg-neutral-900 text-white
        flex items-center justify-between px-4 shadow-md
        /* 常時トップ固定にしたい場合は↓の2つを有効化 */
        /* sticky top-0 z-50 */
      "
    >
      <div className="flex items-center">
        <Item icon="🔋" label="Battery" value={`${battery}%`} ok={battery > 20} />
        <Item icon="🌡️" label="Temp" value={`${temperature}°C`} ok={temperature < 70} />
        <Item icon="📡" label="Network" value={network} ok={network === "Connected" || network === "接続中"} />
        <Item
          icon="🤖"
          label="ROS"
          value={rosStatus === "接続中" ? "接続中" : "切断中"}
          ok={rosStatus === "接続中"}
        />
      </div>

      <div className="flex items-center">
        <Item icon="🎮" label="Gamepad" value={gamepadConnected ? "接続中" : "未接続"} ok={gamepadConnected} />
        <Item icon="⚡" label="FPS" value={fps} ok={Number(fps) >= 20} />
      </div>
    </div>
  );
}
