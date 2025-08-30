import React, { useState, useEffect } from "react";

export default function GaugeModal({
  open, onClose, onApply,
  title = "メーター設定",
  currentDeg = 120, targetDeg = 120,
  minDeg = 0, maxDeg = 180,
}) {
  const [cur, setCur] = useState(currentDeg);
  const [tgt, setTgt] = useState(targetDeg);
  useEffect(()=>{ setCur(currentDeg); setTgt(targetDeg); }, [currentDeg, targetDeg, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
      <div className="w-[min(92vw,460px)] rounded-2xl bg-white p-5 shadow-xl">
        <div className="text-lg font-medium mb-3">{title}</div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-neutral-700">現在値</span>
              <span className="text-neutral-500">{Math.round(cur)}°</span>
            </div>
            <input type="range" min={minDeg} max={maxDeg} value={cur}
              onChange={(e)=>setCur(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-neutral-700">目標値</span>
              <span className="text-neutral-500">{Math.round(tgt)}°</span>
            </div>
            <input type="range" min={minDeg} max={maxDeg} value={tgt}
              onChange={(e)=>setTgt(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-neutral-200" onClick={onClose}>キャンセル</button>
          <button className="px-3 py-1.5 rounded-lg bg-sky-600 text-white"
            onClick={()=>{ onApply({ currentDeg: cur, targetDeg: tgt }); onClose(); }}>
            適用
          </button>
        </div>
      </div>
    </div>
  );
}
