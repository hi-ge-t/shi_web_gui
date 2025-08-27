import React, { useEffect, useState } from "react";
import PortalSelect from "../../ui/PortalSelect";

/**
 * カメラ接続先の配置カード（2列分）
 */
export default function CameraEndpointCard({
  title = "カメラ設定",
  subtitle = "接続先",
  options = [
    { id: "cam1", label: "cam1" },
    { id: "cam2", label: "cam2" },
    { id: "cam3", label: "cam3" },
    { id: "cam4", label: "cam4" },
  ],
  value = {
    leftSmall: "cam2",
    rightSmall: "cam3",
    center: "cam1",
    bottom: "cam4",
  },
  onApply,
  onCancel
}) {
  const [map, setMap] = useState(value);
  useEffect(() => setMap(value), [value]);

  // PortalSelect は value を直接受け取るのでイベント不要
  const setValue = (k) => (v) => setMap((m) => ({ ...m, [k]: v }));
  const apply = () => onApply?.(map);
  const cancel = () => { setMap(value); onCancel?.(); };

  // PortalSelect 用オプション
  const psOptions = options.map(o => ({ value: o.id, label: o.label }));

  const dd = (name, v, className="") => (
    <PortalSelect
      className={`info-input ${className}`}
      value={v}
      options={psOptions}
      onChange={setValue(name)}
    />
  );

  return (
    <section className="card col-span-2">
      <div className="info-header">
        <div>
          <div className="info-title">{title}</div>
          <div className="info-sub">{subtitle}</div>
        </div>
        <div className="info-header-tools" />
      </div>

      <div className="info-body">
        {/* 上段 左・中央大・右 */}
        <div className="grid grid-cols-3 gap-3">
          {dd("leftSmall", map.leftSmall)}
          <div className="col-span-1 grid">{dd("center", map.center)}</div>
          {dd("rightSmall", map.rightSmall)}
        </div>

        {/* 下段 中央大 */}
        <div className="grid place-items-center">
          <div className="w-[240px]">{dd("bottom", map.bottom, "w-full")}</div>
        </div>
      </div>

      <div className="info-footer">
        <button className="btn-ghost btn-sm rounded-xl border" onClick={cancel}>キャンセル</button>
        <button className="btn btn-primary btn-sm rounded-xl border" onClick={apply}>保存</button>
      </div>
    </section>
  );
}
