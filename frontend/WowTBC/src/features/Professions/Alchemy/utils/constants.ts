import { priceGroups } from "@/data/mock";
import type { Group } from "../types";

export const VIAL_IMBUED = { name: "Imbued Vial", qty: 1 };
export const VIAL_CRYSTAL = { name: "Crystal Vial", qty: 1 };

export const SEARCH_GROUPS: Group["searchGroup"][] = [
  "Flask",
  "Elixir",
  "Potion"
];


export const GROUPS: Group[] = [
  {
    key: "Flasks",
    title: "Flasks",
    searchGroup: "Flask",
    recipes: [
      ],
  },
  {
    key: "Elixirs",
    title: "Elixirs",
    searchGroup: "Elixir",
    recipes: [
      ],
  },
  {
    key: "Potions",
    title: "Potions",
    searchGroup: "Potion",
    recipes: [
      ],
  },
];

export const AH_CUT = 0.05;

export const priceMap: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const g of priceGroups) for (const e of g.entries) m[e.name] = e.price;
  return m;
})();

export const ALL_ITEMS: { name: string; price: number; group: string }[] = priceGroups.flatMap((g) =>
  g.entries.map((e) => ({ name: e.name, price: e.price, group: g.title })),
);
