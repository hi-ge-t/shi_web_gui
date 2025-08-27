// ./src/components/CameraEndpointLayout.jsx
import React, { useMemo } from "react";
import PortalSelect from "../../ui/PortalSelect"

// レイアウト上の6枠（Figma準拠）
const SLOTS = [
  { id: "leftTop",    label: "左上（小）" },
  { id: "leftBottom", label: "左下（小）" },
  { id: "centerMain", label: "中央（大）" },
  { id: "rightTop",   label: "右上（小）" },
  { id: "rightBottom",label: "右下（小）" },
  { id: "bottomMain", label: "下部（大）" },
];

/**
 * props:
 * - mapping: { leftTop, leftBottom, centerMain, rightTop, rightBottom, bottomMain }
 * - availableCameras: string[]         例: ['cam0','cam1','cam2','cam3','cam4','cam5']
 * - onChange: (slotId:string, value:string|null) => void
 * - unique?: boolean                    // true なら重複割当を抑止（既定: true）
 */
export default function CameraEndpointLayout({
  mapping,
  availableCameras = [],
  onChange,
  unique = true,
}) {
  // 重複抑止（ユニーク割当）
  const takenBy = useMemo(() => {
    const t = {};
    Object.entries(mapping || {}).forEach(([slot, cam]) => {
      if (cam) t[cam] = slot;
    });
    return t;
  }, [mapping]);

  const optionsFor = (slotId) =>
    (unique
      ? availableCameras.filter((cam) => !takenBy[cam] || takenBy[cam] === slotId)
      : availableCameras
    ).map((cam) => ({ label: cam, value: cam }));

  const cell = (slotId, label, extraClass = "") => (
    <div
      key={slotId}
      className={
        "relative bg-neutral-800/70 border border-neutral-700 rounded-xl p-3 flex items-center justify-center " +
        extraClass
      }
    >
      <div className="absolute top-2 left-3 text-[11px] opacity-70">{label}</div>

      <PortalSelect
        value={mapping?.[slotId] ?? ""}
        placeholder="未割当"
        items={optionsFor(slotId)}          // [{label,value}]
        onValueChange={(v) => onChange?.(slotId, v || null)}
        triggerClassName="min-w-[140px] bg-neutral-900 text-white text-sm border border-neutral-700 rounded-md px-3 py-1"
        contentClassName="bg-neutral-900 text-white border border-neutral-700"
      />
    </div>
  );

  // 既存の cell はそのまま使う前提（classNameを追加できる想定）
  const stack = (topId, topLabel, bottomId, bottomLabel, h = "h-28") => (
    <div className="row-span-3 flex flex-col gap-0"> {/* ← 左右を1コンテナに */}
      {cell(topId, topLabel, `${h} rounded-t-xl`)}
      {cell(bottomId, bottomLabel, `${h} rounded-b-xl border-t-0`)}
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* 3列は固定。4行構成：上段 / 中央大 / 下段 / 下部大 */}
      <div className="grid grid-cols-3 gap-3 margin-top">
        {/* 左列：上下を1つのスタックにしてスキマ0 */}
        <div className="col-start-1 row-start-1 row-span-3">
          {stack("leftTop", "左上（小）", "leftBottom", "左下（小）", "h-28")}
        </div>

        {/* 中央列：上段の高さ合わせ（空） */}
        {/* ✅ h-3 → **h-28** に修正（上段と同じ高さに） */}
        <div className="col-start-2 row-start-1 **h-28**" />

        {/* 右列：上下スタック（スキマ0） */}
        <div className="col-start-3 row-start-1 row-span-3">
          {stack("rightTop", "右上（小）", "rightBottom", "右下（小）", "h-28")}
        </div>

        {/* 中央（大）＝ 1行目と2行目の“間”に相当する独立行 */}
        <div className="col-start-2 row-start-2">
          {cell("centerMain", "中央（大）", "h-40")}
        </div>

        {/* 下部（大）は中央列 */}
        {/* ✅ row-start-3 → **row-start-4** に修正（独立した4行目へ） */}
        <div className="col-start-2 row-start-3">
          {cell("bottomMain", "下部（大）", "h-40")}
        </div>

        {/* 中央列：下段の高さ合わせ（空） */}
        <div className="col-start-2 row-start-6 h-22" />
      </div>
    </div>
  );
}
