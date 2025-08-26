import React from "react";

export default function CenterShaftCard({ data, onSave }) {
  const seq = data?.angle_sequence ?? [];
  const updated = data?.last_updated ?? "-";

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-3">
          <h2 className="card-title">センターシャフト</h2>
          <button
            className="btn btn-primary"
            onClick={() => onSave?.(data) ?? alert("Stub: Save pressed")}
          >
            保存
          </button>
        </div>

        <div className="text-sm text-gray-400 mb-2">
          最終更新: <span className="muted">{updated}</span>
        </div>

        <div className="overflow-auto rounded-lg border border-[var(--border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/20">
              <tr>
                <th className="px-4 py-2 w-24">#</th>
                <th className="px-4 py-2">角度 [deg]</th>
              </tr>
            </thead>
            <tbody>
              {seq.map((v, i) => (
                <tr key={i} className="odd:bg-black/10 even:bg-transparent">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{v}</td>
                </tr>
              ))}
              {seq.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-400" colSpan={2}>
                    データがありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}