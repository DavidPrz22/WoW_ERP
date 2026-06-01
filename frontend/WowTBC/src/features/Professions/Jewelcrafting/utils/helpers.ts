export function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function fmtCopper(n: number) {
  if (!isFinite(n)) return "—";
  if (n < 1) {
    const c = Math.round(n * 10000);
    const g = Math.floor(c / 10000);
    const rem = c % 10000;
    const s = Math.floor(rem / 100);
    const copper = rem % 100;
    const parts = [];
    if (g > 0) parts.push(`${g}g`);
    if (s > 0) parts.push(`${s}s`);
    if (copper > 0 || parts.length === 0) parts.push(`${copper}c`);
    return parts.join(" ");
  }
  return `${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}g`;
}
