// src/lib/cameras.js
export function getCameraSources() {
  // 1) JSONが直で来ていたらそれを優先
  const json = process.env.REACT_APP_CAMERA_SOURCES;
  if (json) {
    try {
      const arr = JSON.parse(json);
      if (Array.isArray(arr)) return arr;
    } catch {}
  }

  // 2) ベースURL + トピック + ラベル から生成
  const base = process.env.REACT_APP_MJPEG_BASE || "http://localhost:8081/stream";
  const topics = (process.env.REACT_APP_CAMERA_TOPICS || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  const labels = (process.env.REACT_APP_CAMERA_LABELS || "")
    .split(",").map(s => s.trim());

  if (topics.length) {
    return topics.map((t, i) => ({
      url: `${base}?topic=${encodeURIComponent(t)}`,
      label: labels[i] || t
    }));
  }

  // 3) 何も設定がなければ、今までの仮ソースをフォールバック
  return [
    { url: "/camera_sample/top_vga.jpg", label: "俯瞰" },
    { url: "/camera_sample/tire_side_in_qvga.jpg", label: "左前" },
    { url: "/camera_sample/tire_side_in_qvga.jpg", label: "左後" },
    { url: "/camera_sample/tire_side_in_qvga.jpg", label: "右前" },
    { url: "/camera_sample/tire_side_in_qvga.jpg", label: "右後" },
    { url: "https://fakeimg.pl/600x400/0022ff,128/ffffff?text=Camera6", label: "サブ" }
  ];
}