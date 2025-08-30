import React, { useEffect, useState } from "react";

export default function MagnetAngleModal({
  open,
  onClose,
  onApply,
  title = "モーダル：磁石角度設定",
  // 角度
  currentDeg = 90,
  targetDeg = 140,
  minDeg = 0,
  maxDeg = 180,
  step = 1,
  // プレビュー
  bgImage,          // 例: "/images/magnet_preview_front.png"（なくてもOK）
  arrowColor = "#28e0b9", // 現在角
  targetColor = "#30a0ff", // 目標角
}) {
  const [tgt, setTgt] = useState(targetDeg);
  useEffect(() => { if (open) setTgt(targetDeg); }, [open, targetDeg]);

  // SVG座標上の矢印先端計算（半円の下中心から）
  const toPos = (deg, r = 110) => {
    const rad = (deg - 180) * Math.PI / 180;
    const cx = 240, cy = 180; // ビューの下中心（W=480,H=360想定）
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  
  const cur = toPos(currentDeg);
  const tgtPos = toPos(tgt);

  if(!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[min(96vw,860px)] rounded-2xl bg-neutral-900 text-white shadow-2xl overflow-hidden">
        {/* ヘッダ */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="text-base md:text-lg font-medium">{title}</div>
          <button onClick={onClose}
            className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20">
            ×
          </button>
        </div>

        {/* プレビュー */}
        <div className="p-5">
          <div className="relative mx-auto rounded-xl overflow-hidden bg-black"
               style={{ width: 800, maxWidth: "100%" }}>
            {/* 背景図（任意） */}
            {bgImage ? (
              <img src={bgImage} alt="" className="w-full h-auto block opacity-90 select-none" draggable={false}/>
            ) : (
              <div className="aspect-[16/9] w-full grid place-items-center text-white/40">
                （プレビュー画像未指定）
              </div>
            )}

            {/* 矢印＆吹き出しはSVGで上に重ねる */}
            <svg viewBox="0 0 480 360"
                 className="absolute inset-0 w-full h-full pointer-events-none">
              {/* 現在角度の矢印 */}
              <defs>
                <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={arrowColor} />
                </marker>
                <marker id="arrowHead2" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill={targetColor} />
                </marker>
              </defs>
              {/* ベース（下中心） */}
              <circle cx="240" cy="180" r="4" fill="white" opacity="0.9" />
              {/* 現在値（太） */}
              <line x1="240" y1="180" x2={cur.x} y2={cur.y}
                    stroke={arrowColor} strokeWidth="6" markerEnd="url(#arrowHead)" />
              {/* 目標値（細） */}
              <line x1="240" y1="180" x2={tgtPos.x} y2={tgtPos.y}
                    stroke={targetColor} strokeWidth="4" markerEnd="url(#arrowHead2)" />

              {/* 吹き出し：現在 */}
              <g transform={`translate(${Math.min(Math.max(cur.x - 45, 10), 480 - 110)}, ${Math.max(cur.y - 55, 8)})`}>
                <rect width="110" height="36" rx="6" fill="#0a0a0a" opacity="0.85" />
                <text x="8" y="23" fontSize="14" fill="#9beadf">現在角度</text>
                <text x="78" y="23" fontSize="14" fill="white">{Math.round(currentDeg)}°</text>
              </g>

              {/* 吹き出し：目標 */}
              <g transform={`translate(${Math.min(Math.max(tgtPos.x - 45, 10), 480 - 110)}, ${Math.max(tgtPos.y - 55, 8)})`}>
                <rect width="110" height="36" rx="6" fill="#0a0a0a" opacity="0.85" />
                <text x="8" y="23" fontSize="14" fill="#aeddff">目標角度</text>
                <text x="78" y="23" fontSize="14" fill="white">{Math.round(tgt)}°</text>
              </g>
            </svg>
          </div>

          {/* スライダー */}
          <div className="mt-6 px-2">
            <div className="flex justify-between text-sm text-neutral-300 mb-1">
              <span>目標角度</span>
              <span className="tabular-nums">{Math.round(tgt)}°</span>
            </div>
            <input
              type="range"
              min={minDeg}
              max={maxDeg}
              step={step}
              value={tgt}
              onChange={(e) => setTgt(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>{minDeg}°</span><span>{maxDeg}°</span>
            </div>
          </div>

          {/* 決定ボタン */}
          <div className="mt-5 flex justify-end gap-2">
            <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
                    onClick={onClose}>キャンセル</button>
            <button className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white"
                    onClick={() => { onApply({ targetDeg: tgt }); onClose(); }}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
