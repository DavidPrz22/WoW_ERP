import type { Recipe } from "../types";
import { priceMap } from "./constants";

export function getReagentPrice(name: string): number {
  return priceMap[name] ?? 0;
}

export function craftingCost(recipe: Recipe): number {
  if (recipe.reagents.length === 0) return priceMap[recipe.name] ?? 0;
  return recipe.reagents.reduce((acc, r) => acc + getReagentPrice(r.name) * r.qty, 0);
}

export function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}
