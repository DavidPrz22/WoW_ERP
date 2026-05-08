export type Faction = "Horde" | "Alliance";
export type Quality = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export const realms = ["Gehennas", "Firemaw", "Mograine", "Pyrewood Village", "Golemagg"];
export const factions: Faction[] = ["Horde", "Alliance"];
export const qualities: Quality[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

export const itemClasses: Record<string, string[]> = {
  Weapon: ["Sword", "Axe", "Mace", "Dagger", "Bow", "Staff"],
  Armor: ["Cloth", "Leather", "Mail", "Plate", "Shield"],
  Consumable: ["Potion", "Elixir", "Flask", "Food", "Bandage"],
  "Trade Goods": ["Herb", "Metal & Stone", "Cloth", "Leather", "Enchanting", "Elemental"],
  Gem: ["Red", "Blue", "Yellow", "Green", "Orange", "Purple", "Meta"],
  Recipe: ["Alchemy", "Enchanting", "Engineering", "Cooking"],
};

export type Item = {
  id: number;
  name: string;
  quality: Quality;
  itemClass: keyof typeof itemClasses;
  subclass: string;
  icon: string;
};

export const items: Item[] = [
  { id: 22829, name: "Super Mana Potion", quality: "Common", itemClass: "Consumable", subclass: "Potion", icon: "🧪" },
  { id: 22832, name: "Super Healing Potion", quality: "Common", itemClass: "Consumable", subclass: "Potion", icon: "❤️" },
  { id: 22452, name: "Primal Earth", quality: "Common", itemClass: "Trade Goods", subclass: "Elemental", icon: "🪨" },
  { id: 22451, name: "Primal Air", quality: "Common", itemClass: "Trade Goods", subclass: "Elemental", icon: "🌪️" },
  { id: 22457, name: "Primal Mana", quality: "Common", itemClass: "Trade Goods", subclass: "Elemental", icon: "✨" },
  { id: 22459, name: "Primal Might", quality: "Rare", itemClass: "Trade Goods", subclass: "Elemental", icon: "💎" },
  { id: 23437, name: "Living Ruby", quality: "Uncommon", itemClass: "Gem", subclass: "Red", icon: "🔴" },
  { id: 23440, name: "Dawnstone", quality: "Uncommon", itemClass: "Gem", subclass: "Yellow", icon: "🟡" },
  { id: 23436, name: "Star of Elune", quality: "Uncommon", itemClass: "Gem", subclass: "Blue", icon: "🔵" },
  { id: 22577, name: "Mote of Mana", quality: "Common", itemClass: "Trade Goods", subclass: "Elemental", icon: "🌟" },
  { id: 22789, name: "Terocone", quality: "Common", itemClass: "Trade Goods", subclass: "Herb", icon: "🌿" },
  { id: 22793, name: "Mana Thistle", quality: "Common", itemClass: "Trade Goods", subclass: "Herb", icon: "🌱" },
  { id: 30183, name: "Nether Vortex", quality: "Rare", itemClass: "Trade Goods", subclass: "Elemental", icon: "🌀" },
  { id: 29434, name: "Badge of Justice", quality: "Epic", itemClass: "Trade Goods", subclass: "Elemental", icon: "🛡️" },
  { id: 32837, name: "Warglaive of Azzinoth", quality: "Legendary", itemClass: "Weapon", subclass: "Sword", icon: "⚔️" },
];

export type AHRecord = {
  id: string;
  realm: string;
  faction: Faction;
  timestamp: string;
  items: number;
};

const now = Date.now();
export const records: AHRecord[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `REC-${1000 + i}`,
  realm: realms[i % realms.length],
  faction: i % 2 === 0 ? "Horde" : "Alliance",
  timestamp: new Date(now - i * 1000 * 60 * 60 * 3).toISOString(),
  items: 8500 + Math.floor(Math.random() * 4500),
}));

export type PricePoint = {
  date: string;
  marketValue: number;
  minBuyout: number;
  numAuctions: number;
  historical: number;
};

export function generateHistory(itemId: number, days = 30): PricePoint[] {
  const base = 1000 + (itemId % 7) * 1500;
  return Array.from({ length: days }).map((_, i) => {
    const drift = Math.sin(i / 3 + itemId) * base * 0.15;
    const noise = (Math.random() - 0.5) * base * 0.1;
    const mv = Math.max(50, Math.round(base + drift + noise));
    return {
      date: new Date(now - (days - i) * 86400000).toISOString().slice(0, 10),
      marketValue: mv,
      minBuyout: Math.round(mv * (0.85 + Math.random() * 0.1)),
      numAuctions: 20 + Math.floor(Math.random() * 200),
      historical: Math.round(mv * (0.95 + Math.random() * 0.1)),
    };
  });
}

export function formatGold(copper: number): string {
  const g = Math.floor(copper / 10000);
  const s = Math.floor((copper % 10000) / 100);
  const c = copper % 100;
  return `${g}g ${s}s ${c}c`;
}

export const qualityColor: Record<Quality, string> = {
  Common: "hsl(var(--quality-common))",
  Uncommon: "hsl(var(--quality-uncommon))",
  Rare: "hsl(var(--quality-rare))",
  Epic: "hsl(var(--quality-epic))",
  Legendary: "hsl(var(--quality-legendary))",
};