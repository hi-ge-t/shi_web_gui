import React from "react";

/**
 * 汎用の情報/設定カード
 *
 * props:
 * - title        : 主タイトル（例: "モータ設定"）
 * - subtitle     : 副タイトル（例: "右前 電流値"）
 * - value        : 現在/設定値（制御用の状態を親で持つ）
 * - onChange     : (newVal) => void
 * - unit         : 単位（例: "A", "mm/s", "℃", "fps"）
 * - type         : "number" | "slider" | "radio" | "text"
 * - min,max,step : 数値/スライダー用
 * - options      : ラジオ用 [{label, value}]
 * - disabled     : true/false
 * - hint         : 補足テキスト
 * - onSave       : クリック時に呼ばれる。未指定なら非表示
 */
export default function InfoCard({
  title,
  subtitle,
  value,
  onChange,
  unit,
  type = "number",
  min,
  max,
  step,
  options = [],
  disabled = false,
  hint,
  onSave,
}) {
  // 入力UIの切り替え
  const renderInput = () => {
    const commonProps = {
      disabled,
      className: "input",
    };

    switch (type) {
      case "text":
        return (
          <input
            {...commonProps}
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder="入力してください"
          />
        );
      case "radio":
        return (
          <div className="grid gap-2">
            {options.map((opt) => (
              <label key={opt.value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  className="accent-blue-500 h-5 w-5"
                  disabled={disabled}
                  checked={value === opt.value}
                  onChange={() => onChange?.(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      case "slider":
        return (
          <div className="grid gap-2">
            <input
              type="range"
              className="w-full"
              min={min ?? 0}
              max={max ?? 100}
              step={step ?? 1}
              value={Number(value ?? 0)}
              disabled={disabled}
              onChange={(e) => onChange?.(Number(e.target.value))}
            />
            <div className="text-right field-help">
              {value}{unit ? ` ${unit}` : ""}
            </div>
          </div>
        );
      case "number":
      default:
        return (
          <div className="flex items-center gap-2">
            <input
              {...commonProps}
              type="number"
              inputMode="decimal"
              min={min}
              max={max}
              step={step}
              value={value ?? ""}
              onChange={(e) => onChange?.(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0"
              style={{ width: "100%" }}
            />
            {unit && <div className="muted">{unit}</div>}
          </div>
        );
    }
  };

  return (
    <section className="card h-full">
      <div className="card-body grid gap-4 h-full">
        {/* ヘッダー行 */}
        <div className="flex items-start justify-between">
          <div>
            <div className="card-title">{title}</div>
            {subtitle && <div className="muted">{subtitle}</div>}
          </div>
          {/* 現在値（radio/slider以外は右肩に軽く見せる） */}
          {type !== "slider" && type !== "radio" && value !== undefined && (
            <div className="text-sm muted whitespace-nowrap">
              現在: <b className="text-white/90">{value}{unit ? ` ${unit}` : ""}</b>
            </div>
          )}
        </div>

        {/* 入力領域 */}
        <div className="grid gap-3">
          {renderInput()}
          {hint && <div className="field-help">{hint}</div>}
        </div>

        {/* アクション（右下寄せ） */}
        {onSave && (
          <div className="mt-auto flex justify-end">
            <button className="btn btn-primary" onClick={onSave}>保存</button>
          </div>
        )}
      </div>
    </section>
  );
}