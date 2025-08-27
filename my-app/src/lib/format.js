// lib/format.js
export const fmt1 = (v, unit = '') => {
  const n = Number(v);
  if (!Number.isFinite(n)) return '—';
  const s = new Intl.NumberFormat('ja-JP', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(n); // 四捨五入で1桁
  return unit ? `${s}${unit}` : s;
};
