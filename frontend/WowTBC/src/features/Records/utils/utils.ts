import { formatGold } from "@/data/mock";

export const formatPrice = (gold: number, showGold: boolean) =>
  showGold ? formatGold(Math.round(gold)) : `${gold/10000}g`;

export const getMarketValuePercentStyles = (percentage: number) => {
  if (percentage === undefined) return 'N/A';
  if (percentage <= 79) return 'text-green-400';
  if (percentage >= 80 && percentage <=109) return 'text-yellow-500';
  if (percentage >= 110 && percentage <= 134) return 'text-orange-500';
  return 'text-red-500';
}
