// src/GamepadControl.js
import React, { useEffect, useRef, useState } from "react";
import ROSLIB from "roslib";
import JoystickVisualizer from "../components/JoystickVisualizer/JoystickVisualizer";

/** ---- Topic名（必要ならここを環境変数に） ---- */
const ROSBRIDGE_URL = process.env.REACT_APP_ROSBRIDGE_URL || "ws://localhost:9090";
const CMD_VEL_TOPIC   = process.env.REACT_APP_CMD_VEL_TOPIC   || "/cmd_vel";
const ANGLE_TOPIC     = process.env.REACT_APP_ANGLE_TOPIC     || "/center_shaft/command/angle"; // std_msgs/Float32
const FRONT_TOPIC     = process.env.REACT_APP_FRONT_TOPIC     || "/magnet/front/command";       // std_msgs/Bool
const REAR_TOPIC      = process.env.REACT_APP_REAR_TOPIC      || "/magnet/rear/command";        // std_msgs/Bool

export default function GamepadControl() {
  /** 接続・入力状態 */
  const [connected, setConnected] = useState(false);
  const [axes, setAxes] = useState([0, 0, 0, 0]);
  const [pressedButtons, setPressedButtons] = useState({ l3: false, r3: false });

  /** GUIパラメータ（緑ゾーン） */
  const [linear, setLinear] = useState(30);   // 0..100 mm/s 想定（相対量）
  const [angular, setAngular] = useState(30); // 0..100 deg/s 想定（相対量）
  const [angleDeg, setAngleDeg] = useState(0);
  const statusItems = [
    { id: "swu-01", label: "電流 : SWU-01", value: "12.3A" },
    { id: "xw540-1", label: "電流 : XW540_1", value: "12.3A" },
    { id: "xw540-2", label: "電流 : XW540_2", value: "12.3A" },
  ];

  /** ROS */
  const rosRef = useRef(null);
  const cmdVelTopicRef = useRef(null);
  const angleTopicRef  = useRef(null);
  const frontTopicRef  = useRef(null);
  const rearTopicRef   = useRef(null);

  /** ROS接続 */
  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: ROSBRIDGE_URL });

    ros.on("connection", () => {
      console.log("ROS connected:", ROSBRIDGE_URL);
      rosRef.current = ros;

      cmdVelTopicRef.current = new ROSLIB.Topic({
        ros, name: CMD_VEL_TOPIC, messageType: "geometry_msgs/msg/Twist",
      });
      angleTopicRef.current = new ROSLIB.Topic({
        ros, name: ANGLE_TOPIC, messageType: "std_msgs/msg/Float32",
      });
      frontTopicRef.current = new ROSLIB.Topic({
        ros, name: FRONT_TOPIC, messageType: "std_msgs/msg/Bool",
      });
      rearTopicRef.current = new ROSLIB.Topic({
        ros, name: REAR_TOPIC, messageType: "std_msgs/msg/Bool",
      });
    });

    ros.on("error", (e) => console.error("ROS error:", e));
    ros.on("close", () => {
      console.log("ROS closed");
      setConnected(false);
      rosRef.current = null;
    });

    return () => {
      try { ros.close(); } catch {}
    };
  }, []);

  /** ゲームパッド監視（L: axes[0]=x, axes[1]=y / R: axes[2]=x, axes[3]=y） */
  useEffect(() => {
    let hasGamepad = false;
    let anim = 0;
    const loop = () => {
      const gp = navigator.getGamepads?.()[0];
      if (gp) {
        if (!hasGamepad) {
          hasGamepad = true;
          setConnected(true);
          console.log("🎮 ゲームパッド接続:", gp.id);
        }
        const xL = gp.axes[0] ?? 0;
        const yL = gp.axes[1] ?? 0;
        const xR = gp.axes[2] ?? 0;
        const yR = gp.axes[3] ?? 0;
        const l3 = gp.buttons[10]?.pressed || false;
        const r3 = gp.buttons[11]?.pressed || false;

        setAxes([xL, yL, xR, yR]);
        setPressedButtons({ l3, r3 });

        // 送信用にマッピング：
        //   並進: 左スティックの前後（yL）→ linear.x（前が正なら -yL）
        //   旋回: 右スティックの左右（xR）→ angular.z
        if (cmdVelTopicRef.current) {
          const lin = scale(linear, 0, 100, 0, 1.0);   // 相対 → 0..1 にスケール（実機側でmm/sへ換算想定）
          const ang = scale(angular, 0, 100, 0, 1.0);  // 同上（deg/s → rad/s換算等は受け側）
          const msg = new ROSLIB.Message({
            linear:  { x: clamp(-yL * lin, -1, 1), y: 0.0, z: 0.0 },
            angular: { x: 0.0, y: 0.0, z: clamp(xR * ang, -1, 1) },
          });
          cmdVelTopicRef.current.publish(msg);
        }
      } else {
        if (hasGamepad) {
          console.log("⛔ ゲームパッド切断");
          hasGamepad = false;
          setConnected(false);
        }
      }
      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [linear, angular]);

  /** 十字キー（GUIボタン）からの簡易移動コマンド */
  const nudge = (dir) => {
    if (!cmdVelTopicRef.current) return;
    const v = scale(linear, 0, 100, 0, 1.0);
    const w = scale(angular, 0, 100, 0, 1.0);
    let linX = 0, angZ = 0;
    if (dir === "up")    linX = +v;
    if (dir === "down")  linX = -v;
    if (dir === "left")  angZ = +w;
    if (dir === "right") angZ = -w;

    cmdVelTopicRef.current.publish(new ROSLIB.Message({
      linear:  { x: clamp(linX, -1, 1), y: 0, z: 0 },
      angular: { x: 0, y: 0, z: clamp(angZ, -1, 1) },
    }));
  };

  /** 前後ON/OFF（トグル） */
  const toggleFront = (state) => {
    if (!frontTopicRef.current) return;
    frontTopicRef.current.publish(new ROSLIB.Message({ data: state === "on" }));
  };
  const toggleRear = (state) => {
    if (!rearTopicRef.current) return;
    rearTopicRef.current.publish(new ROSLIB.Message({ data: state === "on" }));
  };

  /** 角度送信 */
  const sendAngle = () => {
    if (!angleTopicRef.current) return;
    angleTopicRef.current.publish(new ROSLIB.Message({ data: Number(angleDeg) || 0 }));
  };

  return (
    <section className="w-full h-full p-3 md:p-4 bg-[#BFD4B1] rounded-xl border border-emerald-700/30 grid"
      style={{ gridTemplateRows: "auto auto 1fr" }}
    >
      {/* 上段：指令速度（並進/旋回） */}
      <div className="grid grid-cols-2 gap-4">
        <SpeedCard
          title="指令速度 (0–100 mm/s)"
          value={linear}
          onChange={setLinear}
          note="GUIボタンの指令速度値（並進動作）"
        />
        <SpeedCard
          title="指令速度 (0–100 deg/s)"
          value={angular}
          onChange={setAngular}
          note="GUIボタンの指令速度値（旋回動作）"
        />
      </div>

      {/* 中段：十字キー + 縦の大ボタン */}
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-4 items-center">
        {/* 十字キー */}
        <div className="flex items-center justify-center">
          <DPad onNudge={nudge} />
        </div>

        {/* 前/後 ON/OFF */}
        <div className="flex flex-col gap-4">
          <BigPill color="blue" label={["前", "ON"]}  onClick={() => toggleFront("on")} />
          <BigPill color="rose" label={["前", "OFF"]} onClick={() => toggleFront("off")} />
          <BigPill color="blue" label={["後", "ON"]}  onClick={() => toggleRear("on")} />
          <BigPill color="rose" label={["後", "OFF"]} onClick={() => toggleRear("off")} />
        </div>
      </div>

      {/* 下段：角度送信 & ステータス & 既存ジョイスティック可視化 */}
      <div className="mt-3 grid grid-cols-2 gap-4">
        {/* 角度送信 */}
        <div className="bg-white/70 rounded-lg p-3 flex items-center gap-3 shadow-inner">
          <label className="text-sm text-gray-700 shrink-0">角度 [°]</label>
          <input
            type="number"
            inputMode="numeric"
            value={angleDeg}
            onChange={(e) => setAngleDeg(e.target.value)}
            className="w-24 text-center rounded border border-gray-300 py-1"
          />
          <button
            type="button"
            onClick={sendAngle}
            className="ml-auto min-w-32 px-5 py-3 rounded-full bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 active:scale-95"
          >
            角度送信
          </button>
        </div>

        {/* ステータス */}
        <div className="bg-white/70 rounded-lg p-3 shadow-inner">
          <div className="text-sm text-gray-700 mb-2">
            ロボット状態 {connected ? "🟢" : "⚪️"}
          </div>
          <ul className="space-y-2 max-h-28 overflow-auto pr-1">
            {statusItems.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1 text-sm">
                <span className="truncate mr-2">{s.label}</span>
                <span className="font-mono">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </section>
  );
}

/** ---------- 小さめUIコンポーネント ---------- */
function SpeedCard({ title, value, onChange, note }) {
  return (
    <div className="bg-white/70 rounded-lg p-3 shadow-inner">
      <div className="text-sm text-gray-700 mb-2">{title}</div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value), 0, 100))}
          className="w-16 text-center rounded border border-gray-300 py-1"
        />
      </div>
      <div className="text-xs text-gray-600 mt-1">{note}</div>
    </div>
  );
}

function DPad({ onNudge }) {
  const Btn = ({ onClick, children, aria }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow bg-gray-100 hover:bg-gray-200 active:scale-95 transition flex items-center justify-center"
    >
      {children}
    </button>
  );
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-3">
      <div />
      <Btn onClick={() => onNudge("up")} aria="上"><ArrowIcon dir="up" /></Btn>
      <div />
      <Btn onClick={() => onNudge("left")} aria="左"><ArrowIcon dir="left" /></Btn>
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/70 shadow-inner border border-gray-300" />
      <Btn onClick={() => onNudge("right")} aria="右"><ArrowIcon dir="right" /></Btn>
      <div />
      <Btn onClick={() => onNudge("down")} aria="下"><ArrowIcon dir="down" /></Btn>
      <div />
    </div>
  );
}

function BigPill({ color = "emerald", label = ["ON"], onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-20 md:w-24 py-4 md:py-5 rounded-full shadow font-semibold text-white bg-${color}-600 hover:bg-${color}-700 active:scale-95 transition flex flex-col items-center gap-1`}
    >
      {label.map((t) => <span key={t} className="text-base md:text-lg tracking-wide">{t}</span>)}
    </button>
  );
}

function ArrowIcon({ dir = "up" }) {
  const rotate = { up: "0", right: "90", down: "180", left: "-90" }[dir];
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M12 4l-7 8h5v8h4v-8h5z" fill="currentColor" />
    </svg>
  );
}

/** ---------- utils ---------- */
function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
function scale(v, a, b, c, d) {
  const t = (v - a) / (b - a);
  return c + (d - c) * clamp(t, 0, 1);
}
