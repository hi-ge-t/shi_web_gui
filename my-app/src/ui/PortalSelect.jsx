// components/ui/PortalSelect.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** 親の transform/overflow の影響を受けない軽量セレクト */
export default function PortalSelect({
  value,
  options,                 // [{value,label}]
  onChange,
  className = "",
  menuWidthLock = true,    // true: トリガー幅に合わせる
}) {
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);

  const current = options.find(o => o.value === value) || { label: value ?? "", value };

  const updateRect = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      setRect({
        top: r.bottom + window.scrollY,
        left: r.left + window.scrollX,
        width: r.width,
      });
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
        onClick={() => setOpen(v => !v)}
      >
        <span className="truncate">{current?.label ?? "選択"}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
          <path d="M7 10l5 5 5-5z" fill="currentColor"></path>
        </svg>
      </button>

      {/* Menu (portal to body) */}
      {open && rect && createPortal(
        <div
          className="portal-select-menu"
          style={{
            position: "absolute",
            top: rect.top + 4,
            left: rect.left,
            width: menuWidthLock ? rect.width : undefined,
            zIndex: 1000,
          }}
        >
          <ul className="portal-select-list" role="listbox" aria-label="select">
            {options.map(opt => {
              const selected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`portal-select-item${selected ? " is-selected" : ""}`}
                    onClick={() => { onChange?.(opt.value); setOpen(false); }}
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
