import type { RowData } from "./types";

export function calcRowMetrics(row: RowData) {
  const ahCut = row.ah * 0.05;
  const breakeven = row.cost / 0.95;
  const profit = row.ah - ahCut - row.cost;
  const roi = row.cost > 0 ? (profit / row.cost) * 100 : 0;
  return { breakeven, profit, roi };
}

export function formatCurrency(value: number, decimals = 2) {
  return value.toFixed(decimals);
}
