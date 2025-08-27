import React from "react";
import CameraView from "../../views/CameraView";
import GamepadControl from "../../controls/GamepadControl";

/**
 * ページ側（親）で StatusBar を配置し、
 * その下の可用領域の高さを丸ごと渡す前提。
 */
export default function RobotDashboard() {
  return (
    <div
      // 2カラム：左=カメラ(伸縮), 右=ステータス固定幅
      className="
        h-full min-h-0
        grid grid-cols-[minmax(0,1fr)_800px] gap-3
      "
    >
      {/* 左：カメラ領域（高さ/幅ともに親いっぱい） */}
      <section
        className="
          min-w-0 min-h-0 h-full overflow-hidden
          rounded-2xl bg-black
          p-0
        "
      >
        <CameraView />
      </section>

      {/* 右：ステータス＆ジョイスティック（縦スクロール可） */}
      <aside
        className="
          min-w-0 min-h-0 h-full overflow-auto
          rounded-2xl bg-neutral-900/60
          p-4
        "
      >
        <GamepadControl />
      </aside>
    </div>
  );
}
