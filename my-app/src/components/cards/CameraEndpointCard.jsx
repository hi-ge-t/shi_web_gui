import React from "react";

/**
 * カメラ接続先カード（横2列想定）
 * - endpoints: [{label, url}]
 * - onChange(i, newUrl)
 * - onSave()
 */
export default function CameraEndpointCard({ title="カメラ接続先", endpoints=[], onChange, onSave }) {
  return (
    <section className="card h-full col-span-2">
      <div className="card-body grid gap-4 h-full">
        <div className="card-title">{title}</div>

        <div className="grid gap-3">
          {endpoints.map((ep, i) => (
            <div key={i} className="grid items-center gap-2"
                 style={{ gridTemplateColumns: "160px 1fr" }}>
              <div className="label whitespace-nowrap">{ep.label}</div>
              <input
                className="input"
                type="text"
                value={ep.url}
                onChange={(e) => onChange?.(i, e.target.value)}
                placeholder="http://... or ws://..."
              />
            </div>
          ))}
        </div>

        <div className="mt-auto flex justify-end">
          <button className="btn btn-primary" onClick={onSave}>保存</button>
        </div>
      </div>
    </section>
  );
}