import type { BoeItem, NetherPrices } from "../types/types";
import { AH_CUT } from "./constants";

export function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function calculateItemCost(item: BoeItem, netherPrices: NetherPrices): number {
  return item.reagents.reduce((sum, r) => {
    const p =
      r.isNether === "primal"
        ? netherPrices.primal
        : r.isNether === "vortex"
          ? netherPrices.vortex
          : r.price;
    return sum + p * r.qty;
  }, 0) / Math.max(item.yieldQty, 1);
}

export function calculateBreakeven(cost: number): number {
  return cost / (1 - AH_CUT);
}

export function calculateProfit(ahPrice: number, cost: number, hasAhPrice: boolean): number {
  return hasAhPrice ? ahPrice * (1 - AH_CUT) - cost : 0;
}
