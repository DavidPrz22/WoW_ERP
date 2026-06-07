import type { BoeApiItem, NetherPrices } from "../types/types";
import { AH_CUT } from "./constants";

const COPPER_PER_GOLD = 10000;

export function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function copperToGold(copper: number | null): number {
  if (copper == null) return 0;
  return copper / COPPER_PER_GOLD;
}

export function calculateItemCost(item: BoeApiItem, netherPrices: NetherPrices): number {
  const totalCostCopper = item.reagents.reduce((sum, r) => {
    let priceCopper: number;
    if (r.is_nether_input === "primal") {
      priceCopper = netherPrices.primal * COPPER_PER_GOLD;
    } else if (r.is_nether_input === "vortex") {
      priceCopper = netherPrices.vortex * COPPER_PER_GOLD;
    } else {
      const buyout = r.overriden_min_buyout ?? r.min_buyout ?? 0;
      priceCopper = buyout;
    }
    return sum + priceCopper * r.quantity;
  }, 0);
  return totalCostCopper / Math.max(item.yield_quantity, 1);
}

export function calculateBreakeven(costCopper: number): number {
  return costCopper / (1 - AH_CUT);
}

export function calculateProfit(ahPriceCopper: number, costCopper: number, hasAhPrice: boolean): number {
  return hasAhPrice ? ahPriceCopper * (1 - AH_CUT) - costCopper : 0;
}

export function calculateRoi(profit: number, cost: number, hasAhPrice: boolean): number {
  return cost > 0 && hasAhPrice ? (profit / cost) * 100 : 0;
}

export function parseWowCurrency(totalCopper: number) {
  const isNegative = totalCopper < 0;
  const copperValue = Math.round(Math.abs(totalCopper));

  const gold = Math.floor(copperValue / 10000);
  const silver = Math.floor((copperValue % 10000) / 100);
  const copper = copperValue % 100;

  return { isNegative, gold, silver, copper };
}
