import React, { useEffect, useMemo, useState, useCallback } from "react";

/**
 * 見た目はそのまま（.card .info-card などのクラスを維持）
 * - 変更検知で保存ボタンを活性化
 * - Enter=保存 / Esc=キャンセル
 * - blur/保存で min/max にクランプ
 */
export default function InfoCard({
  title,
  subtitle,
  unit = "",
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onApply,
  onCancel,
  className,
  height,
  style = {},
}) {
  const clamp = useCallback((n) => Math.min(max, Math.max(min, n)), [min, max]);

  // 入力用ドラフト値（数値）。入力途中の空文字は許容したいので別に raw 文字列も持つ
  const [draft, setDraft] = useState(() => clamp(Number(value)));
  const [raw, setRaw] = useState(String(value));
  const [dirty, setDirty] = useState(false);

  // 外から value が変わったら同期
  useEffect(() => {
    const v = clamp(Number(value));
    setDraft(v);
    setRaw(String(v));
    setDirty(false);
  }, [value, clamp]);

  // 小数桁の推定（step から推定）
  const decimals = useMemo(() => {
    const s = String(step);
    return s.includes(".") ? (s.split(".")[1]?.length || 0) : 0;
  }, [step]);

  // 表示用文字列（NaN は空文字でごまかす）
  const display = useMemo(() => {
    if (raw === "" || raw === "-" || Number.isNaN(Number(raw))) return "";
    return `${Number(draft).toFixed(decimals)}${unit}`;
  }, [raw, draft, unit, decimals]);

  // number input: 入力途中は自由、確定は blur/保存時
  const handleNumberChange = (e) => {
    const text = e.target.value;
    setRaw(text);
    setDirty(true);

    // 入力途中（空/ハイフン/小数点だけ等）は draft を即更新しない
    const n = Number(text);
    if (!Number.isNaN(n)) {
      setDraft(n);
    }
  };

  const handleNumberBlur = () => {
    // blur で範囲に丸めて表示整形
    const n = Number(raw);
    const next = Number.isNaN(n) ? clamp(Number(value)) : clamp(n);
    setDraft(next);
    setRaw(String(next));
  };

  const handleRangeChange = (e) => {
    const n = clamp(Number(e.target.value));
    setDraft(n);
    setRaw(String(n));
    setDirty(true);
  };

  const apply = () => {
    const n = clamp(Number(raw));
    if (Number.isNaN(n)) return; // 無効
    setDraft(n);
    setRaw(String(n));
    if (onApply) onApply(n);
    setDirty(false);
  };

  const cancel = () => {
    const v = clamp(Number(value));
    setDraft(v);
    setRaw(String(v));
    setDirty(false);
    onCancel?.();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); apply(); }
    if (e.key === "Escape") { e.preventDefault(); cancel(); }
  };

  const saveDisabled =
    !dirty ||
    raw === "" ||
    raw === "-" ||
    Number.isNaN(Number(raw));

  // height は number のとき px 扱いにする
  const mergedStyle = {
    ...(height != null ? { height: typeof height === "number" ? `${height}px` : height } : null),
    ...style,
  };

  return (
    <section className={`card info-card ${className}`} style={mergedStyle}>
      {/* Header（固定高） */}
      <div className="info-header">
        <div>
          <div className="info-title">{title}</div>
          {subtitle && <div className="info-sub">{subtitle}</div>}
        </div>
        <div className="info-header-tools">{/* 右上バッジ/スイッチ等（任意） */}</div>
      </div>

      {/* Body */}
      <div className="info-body">
        {/* 数値入力（上段） */}
        <div className="row">
          <input
            className="info-input"
            value={raw}
            onChange={handleNumberChange}
            onBlur={handleNumberBlur}
            onKeyDown={onKeyDown}
            type="number"
            step={step}
            min={min}
            max={max}
            aria-label={title}
          />
          <span className="muted unit">{unit}</span>
          <div className="muted value">{display}</div>
        </div>

        {/* スライダー（下段） */}
        <input
          className="info-range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={Number.isNaN(draft) ? min : clamp(draft)}
          onChange={handleRangeChange}
          aria-label={`${title} range`}
        />
      </div>

      {/* Footer（ボタンがあるときだけ表示） */}
      {(onApply || onCancel) && (
        <div className="info-footer">
          {onCancel && (
            <button
              className="btn-ghost btn-sm rounded-xl border"
              onClick={cancel}
              type="button"
            >
              キャンセル
            </button>
          )}
          {onApply && (
            <button
              className={`btn btn-primary btn-sm rounded-xl border ${saveDisabled ? "opacity-50 pointer-events-none" : ""}`}
              onClick={apply}
              type="button"
              disabled={saveDisabled}
            >
              保存
            </button>
          )}
        </div>
      )}
    </section>
  );
}
