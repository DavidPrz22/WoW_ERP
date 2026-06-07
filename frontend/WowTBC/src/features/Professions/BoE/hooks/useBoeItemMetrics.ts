import { useMemo } from "react";
import type { BoeApiItem, BoeItemMetrics, NetherPrices } from "../types/types";
import { calculateBreakeven, calculateItemCost, calculateProfit, calculateRoi } from "../utils/helpers";

export function useBoeItemMetrics(item: BoeApiItem, netherPrices: NetherPrices): BoeItemMetrics {
  return useMemo(() => {
    const cost = calculateItemCost(item, netherPrices);
    const breakeven = calculateBreakeven(cost);
    const ahPrice = item.overriden_min_buyout ?? item.min_buyout ?? 0;
    const hasAhPrice = ahPrice > 0;
    const profit = calculateProfit(ahPrice, cost, hasAhPrice);
    const roi = calculateRoi(profit, cost, hasAhPrice);

    return {
      cost,
      breakeven,
      profit,
      roi,
      hasAhPrice,
      ahPrice,
    };
  }, [item, netherPrices]);
}
