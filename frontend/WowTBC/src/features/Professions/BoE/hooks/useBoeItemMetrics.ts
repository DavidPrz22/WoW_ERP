import { useMemo } from "react";
import  type { BoeItem, BoeItemMetrics, NetherPrices } from "../types/types";
import { calculateBreakeven, calculateItemCost, calculateProfit } from "../utils/helpers";

export function useBoeItemMetrics(item: BoeItem, netherPrices: NetherPrices): BoeItemMetrics {
  return useMemo(() => {
    const cost = calculateItemCost(item, netherPrices);
    const breakeven = calculateBreakeven(cost);
    const hasAhPrice = item.ahPrice > 0;
    const profit = calculateProfit(item.ahPrice, cost, hasAhPrice);
    const roi = cost > 0 && hasAhPrice ? (profit / cost) * 100 : 0;

    return {
      cost,
      breakeven,
      profit,
      roi,
      hasAhPrice,
    };
  }, [item, netherPrices]);
}
