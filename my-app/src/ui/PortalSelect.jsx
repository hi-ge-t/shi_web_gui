// components/ui/PortalSelect.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";

/** 親の transform/overflow の影響を受けない軽量セレクト */
export default function PortalSelect({
  value,
  options,                 // [{value,label}] or ['cam0','cam1',...]
  onChange,
  className = "",
  menuWidthLock = true,    // true: トリガー幅に合わせる
}) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);

  // ✅ options を常に配列へ正規化（未定義/null/文字列配列にも対応）
  const list = useMemo(() => {
    const raw = Array.isArray(options) ? options : [];
    return raw
      .filter(Boolean)
      .map((o) => (typeof o === "string" ? { value: o, label: o } : o))
      .filter((o) => o && typeof o.value !== "undefined");
  }, [options]);

  // ✅ 安全に現在表示テキストを求める
  const current = useMemo(
    () => list.find((o) => o.value === value) || { label: value ?? "", value },
    [list, value]
  );

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      // window.scrollY/X は Safari 互換、pageYOffset/pageXOffset でもOK
      const top = (window.scrollY ?? window.pageYOffset ?? 0) + r.bottom + 4;
      const left = (window.scrollX ?? window.pageXOffset ?? 0) + r.left;
      setRect({ top, left, width: r.width });
    }
  };

  useEffect(() => {
    if (!open) return;
    updateRect();
    const onScroll = () => updateRect();
    const onResize = () => updateRect();
    const onClickAway = (e) => {
      if (!btnRef.current) return;
      if (e.target === btnRef.current || btnRef.current.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousedown", onClickAway);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousedown", onClickAway);
    };
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        className={`info-input h-[38px] w-full text-left px-3 flex items-center justify-between ${className}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{current?.label || "選択"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
          <path d="M7 10l5 5 5-5z" fill="currentColor"></path>
        </svg>
      </button>

      {/* Menu (portal to body) */}
      {open && rect &&
        createPortal(
          <div
            className="portal-select-menu"
            style={{
              position: "absolute",            // 必要なら fixed に変更可
              top: rect.top,
              left: rect.left,
              width: menuWidthLock ? rect.width : undefined,
              zIndex: 1000,
            }}
          >
            <ul className="portal-select-list" role="listbox" aria-label="select">
              {list.map((opt) => {
                const selected = opt.value === value;
                return (
                  <li key={String(opt.value)}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={`portal-select-item${selected ? " is-selected" : ""}`}
                      onClick={() => {
                        onChange?.(opt.value);
                        setOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body
        )}
    </>
  );
}
