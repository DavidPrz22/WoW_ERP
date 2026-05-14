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

export type PriceEntry = { name: string; price: number; image?: string };
export type PriceGroup = { title: string; entries: PriceEntry[] };

export const priceGroups: PriceGroup[] = [
  {
    title: "Herb Prices",
    entries: [
      { name: "Felweed", price: 0.6263 },
      { name: "Dreaming Glory", price: 0.36 },
      { name: "Nightmare Vine", price: 1.7667 },
      { name: "Terocone", price: 1.6015 },
      { name: "Ancient Lichen", price: 0.1168 },
      { name: "Netherbloom", price: 5.7397 },
      { name: "Mana Thistle", price: 18.9991 },
      { name: "Ragveil", price: 0.33 },
      { name: "Fel Lotus", price: 1.5676 },
      { name: "Dreamfoil", price: 0.8707 },
      { name: "Mountain Silversage", price: 0.8125 },
      { name: "Plaguebloom", price: 0.4806 },
      { name: "Icecap", price: 0.4966 },
      { name: "Black Lotus", price: 37.9481 },
      { name: "Arthas' Tears", price: 1.2048 },
      { name: "Blindweed", price: 0.4449 },
      { name: "Gromsblood", price: 0.5295 },
      { name: "Firebloom", price: 0.8013 },
      { name: "Golden Sansam", price: 0.4786 },
    ],
  },
  {
    title: "Ore / Bar Prices",
    entries: [
      { name: "Fel Iron Ore", price: 0.3715 },
      { name: "Fel Iron Bar", price: 0.8991 },
      { name: "Adamantite Ore", price: 1.1706 },
      { name: "Adamantite Bar", price: 2.482 },
      { name: "Khorium Ore", price: 1.4945 },
      { name: "Khorium Bar", price: 3.3661 },
      { name: "Eternium Ore", price: 0.9589 },
      { name: "Eternium Bar", price: 2.1194 },
      { name: "Felsteel Bar", price: 7.4586 },
      { name: "Hardened Adamantite Bar", price: 24.994 },
    ],
  },
  {
    title: "Cloth / Leather",
    entries: [
      { name: "Knothide Leather", price: 0.2918 },
      { name: "Knothide Leather Scraps", price: 0.0644 },
      { name: "Heavy Knothide Leather", price: 1.6291 },
      { name: "Wind Scales", price: 0.6435 },
      { name: "Fel Hide", price: 7.8996 },
      { name: "Nether Dragonscales", price: 9.7992 },
      { name: "Thick Clefthoof Leather", price: 2.2286 },
      { name: "Fel Scales", price: 0.2398 },
      { name: "Cobra Scales", price: 8.7379 },
      { name: "Netherweave Cloth", price: 0.1337 },
      { name: "Netherweb Spider Silk", price: 1.8739 },
      { name: "Spellcloth", price: 50.69 },
      { name: "Shadowcloth", price: 52.9897 },
      { name: "Primal Mooncloth", price: 39.9998 },
    ],
  },
  {
    title: "Enchanting Reagents",
    entries: [
      { name: "Arcane Dust", price: 0.8843 },
      { name: "Greater Planar Essence", price: 7.2982 },
      { name: "Large Prismatic Shard", price: 17.9949 },
      { name: "Void Crystal", price: 9.9995 },
      { name: "Large Brilliant Shard", price: 2.5578 },
    ],
  },
  {
    title: "Jewelcrafting",
    entries: [
      { name: "Living Ruby", price: 73.9989 },
      { name: "Dawnstone", price: 18.2688 },
      { name: "Star of Elune", price: 6.6687 },
      { name: "Noble Topaz", price: 32.5488 },
      { name: "Talasite", price: 3.3188 },
      { name: "Nightseye", price: 7.6591 },
      { name: "Adamantite Powder", price: 0.22 },
    ],
  },
  {
    title: "Cooking",
    entries: [
      { name: "Warped Flesh", price: 0.1944 },
      { name: "Figluster's Mudfish", price: 0.2198 },
      { name: "Clefthoof Meat", price: 0.4246 },
      { name: "Chunk o' Basilisk", price: 0.7736 },
      { name: "Icefin Bluefish", price: 0.8606 },
      { name: "Serpent Flesh", price: 0.9526 },
      { name: "Golden Darter", price: 0.9136 },
      { name: "Furious Crawdad", price: 1.1807 },
      { name: "Talbuk Venison", price: 0.2074 },
      { name: "Buzzard Meat", price: 0.0843 },
      { name: "Huge Spotted Feltail", price: 1.4997 },
    ],
  },
  {
    title: "Elementals",
    entries: [
      { name: "Primal Mana", price: 11.2282 },
      { name: "Primal Earth", price: 1.8409 },
      { name: "Primal Life", price: 10.9724 },
      { name: "Primal Fire", price: 20.8992 },
      { name: "Primal Air", price: 14.2879 },
      { name: "Primal Shadow", price: 14.1188 },
      { name: "Primal Water", price: 10.9999 },
      { name: "Mote of Mana", price: 1.02 },
      { name: "Mote of Earth", price: 0.1883 },
      { name: "Mote of Life", price: 1.0373 },
      { name: "Mote of Fire", price: 2.0985 },
      { name: "Mote of Air", price: 1.3858 },
      { name: "Mote of Shadow", price: 1.3827 },
      { name: "Mote of Water", price: 1.1599 },
      { name: "Primal Might", price: 77.8893 },
    ],
  },
  {
    title: "Misc",
    entries: [
      { name: "Fel Iron Casing", price: 3.2483 },
      { name: "Handful of Fel Iron Bolts", price: 0.9534 },
    ],
  },
  {
    title: "Vials",
    entries: [
      { name: "Imbued Vial", price: 0.36 },
      { name: "Crystal Vial", price: 0.04 },
    ],
  },
];