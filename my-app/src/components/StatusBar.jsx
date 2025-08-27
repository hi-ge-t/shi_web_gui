// ./src/components/StatusBar.jsx
import React from "react";
import { fmt1 } from "../lib/format";
import { useRobotStatus } from "../contexts/RobotStatusContext";

/** 高さプリセット（px） */
const SIZE_PRESET = {
  dense: 48,
  normal: 60,
  tall: 72,
};

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

/**
 * StatusBar
 * @param {("dense"|"normal"|"tall"|number)} size - 高さ指定。プリセットかpx数値。
 * @param {string} className - 追加クラス（任意）
 */
export default function StatusBar({ size = "normal", className = "" }) {
  const ctx = useRobotStatus?.();
  const h = typeof size === "number" ? size : (SIZE_PRESET[size] ?? SIZE_PRESET.normal);

  const Container = ({ children }) => (
    <header
      className={`w-full bg-neutral-900 text-white shadow-md overflow-x-hidden ${className}`}
      style={{ height: h }} // ← 外枠の高さを明示
    >
      <div className="mx-auto w-full max-w-[1920px] box-border px-4 h-full">
        {/* 左=fr／右=auto。高さは h にフィット、内側は中央寄せ */}
        <div className="h-full grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
          {children}
        </div>
      </div>
    </header>
  );

  if (!ctx) {
    return (
      <Container>
        <div className="min-w-0 overflow-hidden flex items-center gap-2">
          <div className="text-yellow-300 text-sm">Robot status unavailable</div>
        </div>
        <div />
      </Container>
    );
  }

  // 値の取得（フォールバック付き）
  const heartbeatOk = ctx.heartbeatOk ?? true;
  const tireMotorOk = ctx.tireMotorOk ?? true;
  const magnetMotorOk = ctx.magnetMotorOk ?? true;
  const wifi = ctx.network ?? ctx.wifi ?? "—";
  const battery = Number.isFinite(+ctx.battery) ? +ctx.battery : null;

  const lin = ctx?.velocity?.linear ?? ctx?.speedLinear ?? 0;
  const ang = ctx?.velocity?.angular ?? ctx?.speedAngular ?? 0;

  return (
    <Container>
      {/* 左：操作ボタン2つ + 速度 */}
      <div className="min-w-0 overflow-hidden flex items-center gap-2">
        <OpButton onClick={ctx?.onStart}>開始</OpButton>
        <OpButton intent="danger" onClick={ctx?.onStop}>停止</OpButton>
        <Item icon="🏎️" label="速度" value={`lin ${fmt1(lin, "")} / ang ${fmt1(ang, "")}`} ok />
      </div>

      {/* 右：HB → Tire → Magnet → Wi-Fi → Battery → 設定 */}
      <div className="justify-self-end flex items-center gap-2 flex-wrap">
        <Item icon="💓" label="HB" value={heartbeatOk ? "OK" : "NG"} ok={heartbeatOk} />
        <Item icon="🛞" label="Tire" value={tireMotorOk ? "正常" : "異常"} ok={tireMotorOk} />
        <Item icon="🧲" label="Magnet" value={magnetMotorOk ? "正常" : "異常"} ok={magnetMotorOk} />
        <Item icon="📶" label="Wi-Fi" value={wifi} ok={wifi === "Connected" || wifi === "接続中"} />
        <Item icon="🔋" label="Battery" value={battery == null ? "—" : `${fmt1(battery)}%`} ok={battery == null ? true : battery > 20} />
        <OpButton onClick={ctx?.onOpenSettings}>設定</OpButton>
      </div>
    </Container>
  );
}
