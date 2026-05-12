import type { Quality } from "@/types/types";

export const qualityColor: Record<Quality, string> = {
    Common: "hsl(var(--quality-common))",
    Uncommon: "hsl(var(--quality-uncommon))",
    Rare: "hsl(var(--quality-rare))",
    Epic: "hsl(var(--quality-epic))",
    Legendary: "hsl(var(--quality-legendary))",
};

export const SERIES_COLORS = [
  "hsl(42, 78%, 55%)",
  "hsl(120, 60%, 45%)",
  "hsl(217, 100%, 50%)",
  "hsl(277, 75%, 60%)",
  "hsl(30, 100%, 50%)",
  "hsl(0, 70%, 45%)",
];