import { AH_CUT, COPPER_PER_GOLD, COPPER_PER_SILVER } from "./constants";
import type { EngItem, EngReagent } from "../types";

export function getReagentPrice(reagent: EngReagent): number {
  if (reagent.overriden_min_buyout !== null && reagent.overriden_min_buyout !== undefined) {
    return reagent.overriden_min_buyout;
  }
  return reagent.min_buyout ?? 0;
}

export function calculateCraftingCost(reagents: EngReagent[], yieldQuantity: number): number {
  const yieldQty = yieldQuantity && yieldQuantity > 0 ? yieldQuantity : 1;
  const totalReagentCost = reagents.reduce(
    (sum, reagent) => {
      const price = getReagentPrice(reagent);
      return sum + price * reagent.quantity;
    },
    0
  );
  return Math.round(totalReagentCost / yieldQty);
}

export function calculateExplosiveCost(
  explosive: EngItem,
  parts: EngItem[],
  buyReagentsToggle: boolean
): number {
  const partCostMap = new Map<string, number>();
  if (buyReagentsToggle) {
    for (const part of parts) {
      const partCraftingCost = calculateCraftingCost(part.reagents, part.yield_quantity);
      partCostMap.set(part.name, partCraftingCost);
    }
  }

  const totalCost = explosive.reagents.reduce((sum, reagent) => {
    if (buyReagentsToggle && partCostMap.has(reagent.name)) {
      return sum + partCostMap.get(reagent.name)! * reagent.quantity;
    }
    return sum + getReagentPrice(reagent) * reagent.quantity;
  }, 0);

  const yieldQty = explosive.yield_quantity > 0 ? explosive.yield_quantity : 1;
  return Math.round(totalCost / yieldQty);
}

export function calculateBreakeven(craftingCost: number): number {
  return Math.round(craftingCost / (1 - AH_CUT));
}

export function calculateProfitPerItem(ahPrice: number, craftingCost: number): number {
  return Math.round(ahPrice * (1 - AH_CUT) - craftingCost);
}

export function calculateROI(profitPerItem: number, craftingCost: number): number {
  if (craftingCost <= 0) return 0;
  return Math.round((profitPerItem / craftingCost) * 10000) / 100;
}

export function parseWowCurrency(totalCopper: number) {
  const isNegative = totalCopper < 0;
  const copperValue = Math.round(Math.abs(totalCopper));
  const gold = Math.floor(copperValue / COPPER_PER_GOLD);
  const silver = Math.floor((copperValue % COPPER_PER_GOLD) / COPPER_PER_SILVER);
  const copper = copperValue % COPPER_PER_SILVER;
  return { isNegative, gold, silver, copper };
}
