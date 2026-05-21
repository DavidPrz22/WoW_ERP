import type { Recipe } from "../types";
import { priceMap } from "./constants";

export function getReagentPrice(name: string, customPriceMap?: Record<string, number>): number {
  if (customPriceMap && name in customPriceMap) {
    return customPriceMap[name];
  }
  return priceMap[name] ?? 0;
}

export function craftingCost(recipe: Recipe, customPriceMap?: Record<string, number>): number {
  if (recipe.reagents.length === 0) {
    if (customPriceMap && recipe.name in customPriceMap) {
      return customPriceMap[recipe.name];
    }
    return priceMap[recipe.name] ?? 0;
  }
  return recipe.reagents.reduce((acc, r) => acc + getReagentPrice(r.name, customPriceMap) * r.qty, 0);
}

export function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

