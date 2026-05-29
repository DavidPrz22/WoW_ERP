import { priceGroups } from "@/data/mock";
import type { ProspectResult, CutSection } from "../types/types";

export const AH_CUT = 0.05;

export const priceMap: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  for (const g of priceGroups) {
    for (const e of g.entries) {
      m[e.name] = e.price;
    }
  }
  return m;
})();

export const PROSPECT_ORE = "Adamantite Ore";
export const PROSPECT_PER_BATCH = 5; // ore prospected per attempt

export const PROSPECT_RESULTS: ProspectResult[] = [
  { name: "Azure Moonstone", chance: 0.18, expected: 36 },
  { name: "Deep Peridot", chance: 0.18, expected: 36 },
  { name: "Flame Spessarite", chance: 0.18, expected: 36 },
  { name: "Shadow Draenite", chance: 0.18, expected: 36 },
  { name: "Blood Garnet", chance: 0.18, expected: 36 },
  { name: "Golden Draenite", chance: 0.18, expected: 36 },
  { name: "Living Ruby", chance: 0.04, expected: 7.6 },
  { name: "Noble Topaz", chance: 0.04, expected: 7.6 },
  { name: "Dawnstone", chance: 0.04, expected: 7.6 },
  { name: "Talasite", chance: 0.04, expected: 7.6 },
  { name: "Star of Elune", chance: 0.04, expected: 7.6 },
  { name: "Nightseye", chance: 0.04, expected: 7.6 },
  { name: "Adamantite Powder", chance: 1.0, expected: 200, vendor: 0.22 },
];

export const CUT_SECTIONS: CutSection[] = [
  {
    key: "red",
    color: "bg-[hsl(0_72%_45%)]",
    label: "Red",
    gem: "Living Ruby",
    cuts: [
      { name: "Bold Living Ruby", ahPrice: 69.8223 },
      { name: "Runed Living Ruby", ahPrice: 68.9997 },
      { name: "Delicate Living Ruby", ahPrice: 70.4899 },
      { name: "Teardrop Living Ruby", ahPrice: 70.9499 },
    ],
  },
  {
    key: "yellow",
    color: "bg-[hsl(48_90%_55%)]",
    label: "Yellow",
    gem: "Dawnstone",
    cuts: [
      { name: "Smooth Dawnstone", ahPrice: 22.9899 },
      { name: "Rigid Dawnstone", ahPrice: 23.9494 },
      { name: "Great Dawnstone", ahPrice: 24.8001 },
      { name: "Brilliant Dawnstone", ahPrice: 24.7992 },
      { name: "Mystic Dawnstone", ahPrice: 24.9997 },
    ],
  },
  {
    key: "orange",
    color: "bg-[hsl(24_90%_55%)]",
    label: "Orange",
    gem: "Noble Topaz",
    cuts: [
      { name: "Luminous Noble Topaz", ahPrice: 42.998 },
      { name: "Veiled Noble Topaz", ahPrice: 35.9998 },
      { name: "Inscribed Noble Topaz", ahPrice: 40.9599 },
      { name: "Potent Noble Topaz", ahPrice: 40.9596 },
      { name: "Glinting Noble Topaz", ahPrice: 39.949 },
    ],
  },
  {
    key: "blue",
    color: "bg-[hsl(214_80%_50%)]",
    label: "Blue",
    gem: "Star of Elune",
    cuts: [
      { name: "Solid Star of Elune", ahPrice: 6.6977 },
      { name: "Stormy Star of Elune", ahPrice: 6.1898 },
      { name: "Sparkling Star of Elune", ahPrice: 4.8993 },
    ],
  },
  {
    key: "purple",
    color: "bg-[hsl(280_55%_45%)]",
    label: "Purple",
    gem: "Nightseye",
    cuts: [
      { name: "Shifting Nightseye", ahPrice: 9.9509 },
      { name: "Glowing Nightseye", ahPrice: 10.4987 },
      { name: "Royal Nightseye", ahPrice: 10.4489 },
      { name: "Sovereign Nightseye", ahPrice: 9.8999 },
    ],
  },
  {
    key: "green",
    color: "bg-[hsl(142_55%_40%)]",
    label: "Green",
    gem: "Talasite",
    cuts: [
      { name: "Enduring Talasite", ahPrice: 4.6993 },
      { name: "Jagged Talasite", ahPrice: 6.3987 },
      { name: "Radiant Talasite", ahPrice: 4.9888 },
      { name: "Dazzling Talasite", ahPrice: 5.4987 },
    ],
  },
];
