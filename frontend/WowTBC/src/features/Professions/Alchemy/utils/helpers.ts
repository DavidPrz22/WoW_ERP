import { AH_CUT } from "./constants";

export function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function calculateBreakeven(craftingCost: number): number {
  return craftingCost / (1 - AH_CUT);
}

export function calculateProfitPerItem(ahPrice: number, craftingCost: number): number {
  return (ahPrice * (1 - AH_CUT)) - craftingCost;
}

export function calculateROI(profitPerItem: number, craftingCost: number): number {
  return craftingCost > 0 ? (profitPerItem / craftingCost) * 100 : 0;
}

export function calculateTotalCost(craftingCost: number, qty: number): number {
  return craftingCost * qty;
}

export function calculateExpectedProfit(profitPerItem: number, qty: number): number {
  return profitPerItem * qty;
}

export function parseWowCurrency(totalCopper: number) {
  const isNegative = totalCopper < 0;
  const copperValue = Math.round(Math.abs(totalCopper)); 

  const gold = Math.floor(copperValue / 10000);
  const silver = Math.floor((copperValue % 10000) / 100);
  const copper = copperValue % 100;

  return { isNegative, gold, silver, copper };
}

