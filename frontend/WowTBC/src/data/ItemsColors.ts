import type { Quality } from "@/types/types";

export const qualityColor: Record<Quality, string> = {
    Common: "hsl(var(--quality-common))",
    Uncommon: "hsl(var(--quality-uncommon))",
    Rare: "hsl(var(--quality-rare))",
    Epic: "hsl(var(--quality-epic))",
    Legendary: "hsl(var(--quality-legendary))",
};