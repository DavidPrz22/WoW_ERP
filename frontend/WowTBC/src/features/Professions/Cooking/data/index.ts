import type { BuffType, Recipe } from "../types";

export const AH_CUT = 0.05;

export const BUFF_META: Record<BuffType, { label: string; color: string; dot: string }> = {
  AGI:  { label: "Agility",      color: "bg-[hsl(142_55%_50%)]", dot: "bg-[hsl(142_55%_50%)]" },
  SP:   { label: "Spell Power",  color: "bg-[hsl(214_80%_55%)]", dot: "bg-[hsl(214_80%_55%)]" },
  STA:  { label: "Stamina",      color: "bg-[hsl(0_72%_45%)]",   dot: "bg-[hsl(0_72%_45%)]" },
  STR:  { label: "Strength",     color: "bg-[hsl(24_60%_45%)]",  dot: "bg-[hsl(24_60%_45%)]" },
  HEAL: { label: "Healing",      color: "bg-[hsl(48_70%_50%)]",  dot: "bg-[hsl(48_70%_50%)]" },
  HIT:  { label: "Hit Rating",   color: "bg-[hsl(280_55%_60%)]", dot: "bg-[hsl(280_55%_60%)]" },
  PET:  { label: "Pet",          color: "bg-[hsl(180_55%_45%)]", dot: "bg-[hsl(180_55%_45%)]" },
};

export const ORDER: BuffType[] = ["AGI", "SP", "STA", "STR", "HEAL", "HIT", "PET"];

export const RECIPES: Recipe[] = [
  { name: "Warp Burger",        buff: "AGI",  craftingCost: 0.594,  ahPrice: 0.8035 },
  { name: "Grilled Mudfish",    buff: "AGI",  craftingCost: 0.2992, ahPrice: 0.3446 },
  { name: "Crunchy Serpent",    buff: "SP",   craftingCost: 0.9398, ahPrice: 1.2247 },
  { name: "Poached Bluefish",   buff: "SP",   craftingCost: 0.9475, ahPrice: 0.9855 },
  { name: "Blackened Basilisk", buff: "SP",   craftingCost: 0.769,  ahPrice: 0.9625 },
  { name: "Spicy Crawdad",      buff: "STA",  craftingCost: 0.6862, ahPrice: 0.7386 },
  { name: "Fisherman's Feast",  buff: "STA",  craftingCost: 0,      ahPrice: 0 },
  { name: "Roasted Clefthoof",  buff: "STR",  craftingCost: 0.4223, ahPrice: 0.5041 },
  { name: "Golden Fish Sticks", buff: "HEAL", craftingCost: 1.1081, ahPrice: 1.2261 },
  { name: "Kibler's Bits",      buff: "PET",  craftingCost: 0.17,   ahPrice: 0.3996 },
  { name: "Spicy Hot Talbuk",   buff: "HIT",  craftingCost: 0.417,  ahPrice: 0.6041 },
];
