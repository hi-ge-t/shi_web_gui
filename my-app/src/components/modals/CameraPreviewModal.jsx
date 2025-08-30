import React, { useEffect, useRef } from "react";

export default function CameraPreviewModal({
  open,
  onClose,
  title = "Camera Preview",
  src,                   // 画像/MJPEG URL
  aspect = "4:3",        // "4:3" or "16:9"
  meta = {},             // {cameraId, fps, resolution, hint, disableCache}
}) {
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const bust = meta?.disableCache ? `&_=${Date.now()}` : "";

  const handleBackdrop = (e) => {
    if (e.target === backdropRef.current) onClose?.();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-label={title}
    >
      <div className="w-[min(96vw,1100px)] max-w-[96vw] bg-neutral-900 text-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
            <p className="text-xs sm:text-sm text-white/70 mt-0.5 truncate">
              {meta?.cameraId ? `ID: ${meta.cameraId} ` : ""}
              {meta?.resolution ? `・${meta.resolution}` : ""}
              {meta?.fps ? `・${meta.fps}fps` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            閉じる
          </button>
        </div>

        {/* Body */}
        <div className="relative bg-black">
          <div className={aspect === "4:3" ? "aspect-[4/3]" : "aspect-video"}>
            {src ? (
              <img
                src={`${src}${src.includes("?") ? "&" : "?"}preview=1${bust}`}
                alt={title}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-white/60">
                ソース未設定
              </div>
            )}
          </div>
        </div>

        {meta?.hint && (
          <div className="px-4 sm:px-6 py-3 border-t border-white/10 text-sm text-white/70">
            {meta.hint}
          </div>
        )}
      </div>
    </div>
  );
}
