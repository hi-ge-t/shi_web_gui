import { createContext, useContext } from "react";

const RobotStatusContext = createContext();

export const useRobotStatus = () => useContext(RobotStatusContext);

export default RobotStatusContext;

/*TODO：以下に切り替え予定
// 例: contexts/RobotStatusContext.js の中身イメージ
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const Ctx = createContext(null);

export default function RobotStatusProvider({ children }) {
  const [state, setState] = useState({
    heartbeat: false,
    battery: 82,
    network: "disconnected", // "connected" / "disconnected"
    speed: 100,
    distance: 0,
    temperature: 31.2,
    current: 12.3,
    powerBus: "24V系",
    motors: { front: 20, rear: 20, mode: "normal" },
    cameras: { selected: "cam-0", fps: 30, resolution: "QVGA", exposure: 30, gain: 10 },
  });

  // 将来：バックエンドと接続（WebSocket/SSE/HTTPポーリングなど）
  useEffect(() => {
    // 例: WebSocket
    // const ws = new WebSocket("ws://localhost:8000/status");
    // ws.onmessage = (e) => {
    //   const patch = JSON.parse(e.data);
    //   setState((prev) => ({ ...prev, ...patch }));
    // };
    // return () => ws.close();
  }, []);

  const api = useMemo(() => ({
    ...state,
    setPartial: (patch) => setState((prev) => ({ ...prev, ...patch })),
  }), [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useRobotStatus() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRobotStatus must be used within RobotStatusProvider");
  return ctx;
}
  */