// ./src/components/StatusBar.jsx
import React from "react";
import { fmt1 } from "../lib/format";
import { useRobotStatus } from "../contexts/RobotStatusContext";

const Item = ({ icon, label, value, ok = true }) => (
  <div className="flex items-center gap-2 px-3 py-1 min-w-0">
    <span className="text-lg shrink-0">{icon}</span>
    <span className="text-xs opacity-80 shrink-0 hidden md:inline">{label}:</span>
    <span className={`text-sm font-semibold min-w-0 truncate ${ok ? "text-green-400" : "text-red-400"}`}>
      {value}
    </span>
  </div>
);

const OpButton = ({ children, intent = "primary", onClick }) => {
  const base = "px-3 py-1 rounded text-sm font-medium shadow-sm border";
  const style =
    intent === "danger"
      ? "bg-red-600/80 hover:bg-red-600 text-white border-red-500/60"
      : "bg-blue-600/80 hover:bg-blue-600 text-white border-blue-500/60";
  return (
    <button type="button" onClick={onClick} className={`${base} ${style}`}>
      {children}
    </button>
  );
};

export default function StatusBar() {
  const ctx = useRobotStatus?.();

  if (!ctx) {
    // Provider未接続や初期化前は安全にスケルトン表示
    return (
      <header className="w-full bg-neutral-900 text-white shadow-md">
        <div className="mx-auto w-full max-w-[1920px] box-border px-4">
          <div className="min-h-[60px] py-2 grid grid-cols-[minmax(0,1fr)_auto] items-center">
            <div className="text-yellow-300 text-sm">Robot status unavailable</div>
          </div>
        </div>
      </header>
    );
  }

  // 受け取り値（存在しない場合はフォールバック）
  const heartbeatOk = ctx.heartbeatOk ?? true;                 // boolean
  const tireMotorOk = ctx.tireMotorOk ?? true;                  // boolean
  const magnetMotorOk = ctx.magnetMotorOk ?? true;              // boolean
  const wifi = ctx.network ?? ctx.wifi ?? "—";                  // string ("接続中"など)
  const battery = Number.isFinite(+ctx.battery) ? +ctx.battery : null;

  // 速度（仮: ctx.velocity?.linear / ctx.velocity?.angular を優先）
  const lin = ctx?.velocity?.linear ?? ctx?.speedLinear ?? 0;
  const ang = ctx?.velocity?.angular ?? ctx?.speedAngular ?? 0;

  return (
    <header className="w-full bg-neutral-900 text-white shadow-md overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1920px] box-border px-4">
        {/* 左=fr（縮む）／右=auto（内容幅）で右端吸着 */}
        <div className="min-h-[60px] py-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
          {/* 左：操作ボタン2つ + ロボット速度情報 */}
          <div className="min-w-0 overflow-hidden flex items-center gap-2">
            <OpButton onClick={ctx?.onStart}>開始</OpButton>
            <OpButton intent="danger" onClick={ctx?.onStop}>停止</OpButton>

            {/* 速度表示（例：lin/ang を1桁で） */}
            <Item
              icon="🏎️"
              label="速度"
              value={`lin ${fmt1(lin, "")} / ang ${fmt1(ang, "")}`}
              ok={true}
            />
          </div>

          {/* 右：ハートビート → タイヤ → 磁石 → Wi-Fi → バッテリー → 設定 */}
          <div className="justify-self-end flex items-center gap-2 flex-wrap">
            <Item icon="💓" label="HB" value={heartbeatOk ? "OK" : "NG"} ok={heartbeatOk} />
            <Item icon="🛞" label="Tire" value={tireMotorOk ? "正常" : "異常"} ok={tireMotorOk} />
            <Item icon="🧲" label="Magnet" value={magnetMotorOk ? "正常" : "異常"} ok={magnetMotorOk} />
            <Item
              icon="📶"
              label="Wi-Fi"
              value={wifi}
              ok={wifi === "Connected" || wifi === "接続中"}
            />
            <Item
              icon="🔋"
              label="Battery"
              value={battery == null ? "—" : `${fmt1(battery)}%`}
              ok={battery == null ? true : battery > 20}
            />
            <OpButton onClick={ctx?.onOpenSettings}>設定</OpButton>
          </div>
        </div>
      </div>
    </header>
  );
}
