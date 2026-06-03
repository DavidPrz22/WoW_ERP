import type { BoeItem, Category, Profession } from "../types/types";

export const AH_CUT = 0.05;

// Mock dataset inspired by reference image
export const BOE_ITEMS: BoeItem[] = [
  // Tailoring
  { name: "Spellstrike Hood", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 825.99,
    reagents: [{ name: "Spellcloth", qty: 4, price: 50.69 }, { name: "Primal Mana", qty: 12, price: 11.22 }, { name: "Rune Thread", qty: 1, price: 0.5 }] },
  { name: "Spellstrike Pants", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 916.99,
    reagents: [{ name: "Spellcloth", qty: 4, price: 50.69 }, { name: "Primal Mana", qty: 12, price: 11.22 }, { name: "Rune Thread", qty: 1, price: 0.5 }] },
  { name: "Whitemend Hood", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 999.99,
    reagents: [{ name: "Primal Mooncloth", qty: 8, price: 39.99 }, { name: "Primal Life", qty: 16, price: 10.97 }] },
  { name: "Whitemend Pants", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 820.95,
    reagents: [{ name: "Primal Mooncloth", qty: 8, price: 39.99 }, { name: "Primal Life", qty: 16, price: 10.97 }] },
  { name: "Girdle of Ruination", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 920.95,
    reagents: [{ name: "Shadowcloth", qty: 6, price: 52.98 }, { name: "Primal Shadow", qty: 12, price: 14.11 }] },
  { name: "Black Belt of Knowledge", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 389.99,
    reagents: [{ name: "Shadowcloth", qty: 4, price: 52.98 }, { name: "Primal Mana", qty: 8, price: 11.22 }] },
  { name: "Unyielding Girdle", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 998.99,
    reagents: [{ name: "Spellcloth", qty: 6, price: 50.69 }, { name: "Primal Earth", qty: 12, price: 1.84 }] },
  { name: "Resolute Cape", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 744.98,
    reagents: [{ name: "Primal Mooncloth", qty: 6, price: 39.99 }, { name: "Primal Air", qty: 10, price: 14.28 }] },
  { name: "Vengeance Wrap", category: "Gear", profession: "Tailoring", yieldQty: 1, ahPrice: 899.98,
    reagents: [{ name: "Spellcloth", qty: 6, price: 50.69 }, { name: "Primal Fire", qty: 10, price: 20.89 }] },

  // Blacksmithing
  { name: "Fel Edge Battleaxe", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 1700.99,
    reagents: [{ name: "Felsteel Bar", qty: 14, price: 7.45 }, { name: "Hardened Adamantite Bar", qty: 8, price: 24.99 }, { name: "Primal Earth", qty: 6, price: 1.84 }] },
  { name: "Eternium Runed Blade", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 1998.99,
    reagents: [{ name: "Eternium Bar", qty: 12, price: 2.11 }, { name: "Adamantite Bar", qty: 18, price: 2.48 }, { name: "Primal Mana", qty: 8, price: 11.22 }] },
  { name: "Hand of Eternity", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 1999.99,
    reagents: [{ name: "Hardened Adamantite Bar", qty: 12, price: 24.99 }, { name: "Primal Might", qty: 4, price: 77.88 }] },
  { name: "Blessed Bracers", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 0,
    reagents: [{ name: "Hardened Adamantite Bar", qty: 8, price: 24.99 }, { name: "Primal Life", qty: 8, price: 10.97 }, { name: "Nether Vortex", qty: 4, price: 0, isNether: "vortex" }] },
  { name: "Bracers of the Green Fortress", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 669.69,
    reagents: [{ name: "Hardened Adamantite Bar", qty: 8, price: 24.99 }, { name: "Felsteel Bar", qty: 10, price: 7.45 }] },
  { name: "Black Felsteel Bracers", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 699.94,
    reagents: [{ name: "Felsteel Bar", qty: 12, price: 7.45 }, { name: "Primal Shadow", qty: 6, price: 14.11 }] },
  { name: "Helm of the Stalwart Defender", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 0,
    reagents: [{ name: "Hardened Adamantite Bar", qty: 10, price: 24.99 }, { name: "Primal Earth", qty: 8, price: 1.84 }] },
  { name: "Oathkeeper's Helm", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 2250.99,
    reagents: [{ name: "Hardened Adamantite Bar", qty: 12, price: 24.99 }, { name: "Primal Might", qty: 4, price: 77.88 }, { name: "Primal Nether", qty: 2, price: 0, isNether: "primal" }] },
  { name: "Gauntlets of the Iron Tower", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 1150,
    reagents: [{ name: "Hardened Adamantite Bar", qty: 8, price: 24.99 }, { name: "Felsteel Bar", qty: 10, price: 7.45 }] },
  { name: "Steelgrip Gauntlets", category: "Gear", profession: "Blacksmithing", yieldQty: 1, ahPrice: 599.99,
    reagents: [{ name: "Felsteel Bar", qty: 14, price: 7.45 }, { name: "Primal Earth", qty: 6, price: 1.84 }] },

  // Leatherworking
  { name: "Windslayer Wraps", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 424.99,
    reagents: [{ name: "Heavy Knothide Leather", qty: 18, price: 1.62 }, { name: "Wind Scales", qty: 16, price: 0.64 }, { name: "Primal Air", qty: 12, price: 14.28 }] },
  { name: "Gloves of the Living Touch", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 625.99,
    reagents: [{ name: "Heavy Knothide Leather", qty: 18, price: 1.62 }, { name: "Primal Life", qty: 14, price: 10.97 }] },
  { name: "Cobrascale Gloves", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 999.99,
    reagents: [{ name: "Cobra Scales", qty: 30, price: 8.73 }, { name: "Primal Air", qty: 8, price: 14.28 }] },
  { name: "Hood of Primal Life", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 719.99,
    reagents: [{ name: "Heavy Knothide Leather", qty: 22, price: 1.62 }, { name: "Primal Life", qty: 18, price: 10.97 }] },
  { name: "Windslayer Hood", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 1650,
    reagents: [{ name: "Heavy Knothide Leather", qty: 22, price: 1.62 }, { name: "Wind Scales", qty: 18, price: 0.64 }, { name: "Primal Nether", qty: 2, price: 0, isNether: "primal" }] },
  { name: "Cobrascale Hood", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 998.98,
    reagents: [{ name: "Cobra Scales", qty: 36, price: 8.73 }, { name: "Primal Air", qty: 10, price: 14.28 }] },
  { name: "Living Dragonscale Helm", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 0,
    reagents: [{ name: "Nether Dragonscales", qty: 18, price: 9.79 }, { name: "Primal Life", qty: 14, price: 10.97 }] },
  { name: "Netherdrake Helm", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 0,
    reagents: [{ name: "Nether Dragonscales", qty: 22, price: 9.79 }, { name: "Primal Nether", qty: 1, price: 0, isNether: "primal" }] },
  { name: "Netherdrake Gloves", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 0,
    reagents: [{ name: "Nether Dragonscales", qty: 18, price: 9.79 }, { name: "Primal Nether", qty: 1, price: 0, isNether: "primal" }] },
  { name: "Windslayer Gloves", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 888,
    reagents: [{ name: "Heavy Knothide Leather", qty: 16, price: 1.62 }, { name: "Wind Scales", qty: 14, price: 0.64 }] },
  { name: "Earthen Netherscale Boots", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 345.96,
    reagents: [{ name: "Nether Dragonscales", qty: 12, price: 9.79 }, { name: "Primal Earth", qty: 10, price: 1.84 }] },
  { name: "Thick Netherscale Breastplate", category: "Gear", profession: "Leatherworking", yieldQty: 1, ahPrice: 795,
    reagents: [{ name: "Nether Dragonscales", qty: 20, price: 9.79 }, { name: "Heavy Knothide Leather", qty: 20, price: 1.62 }] },

  // Enhancements (Tailoring)
  { name: "Netherweave Bag", category: "Enhancement", profession: "Tailoring", yieldQty: 1, ahPrice: 14.99,
    reagents: [{ name: "Netherweave Cloth", qty: 24, price: 0.13 }, { name: "Rune Thread", qty: 1, price: 0.5 }] },
  { name: "Imbued Netherweave Bag", category: "Enhancement", profession: "Tailoring", yieldQty: 1, ahPrice: 24.99,
    reagents: [{ name: "Netherweave Cloth", qty: 30, price: 0.13 }, { name: "Arcane Dust", qty: 8, price: 0.88 }] },

  // Enhancements (Leatherworking / Misc)
  { name: "Nethercobra Leg Armor", category: "Enhancement", profession: "Leatherworking", yieldQty: 1, ahPrice: 99.99,
    reagents: [{ name: "Cobra Scales", qty: 6, price: 8.73 }, { name: "Primal Nether", qty: 1, price: 0, isNether: "primal" }] },
  { name: "Nethercleft Leg Armor", category: "Enhancement", profession: "Leatherworking", yieldQty: 1, ahPrice: 89.99,
    reagents: [{ name: "Nether Dragonscales", qty: 4, price: 9.79 }, { name: "Primal Nether", qty: 1, price: 0, isNether: "primal" }] },
  { name: "Runic Spellthread", category: "Enhancement", profession: "Tailoring", yieldQty: 1, ahPrice: 79.99,
    reagents: [{ name: "Primal Mana", qty: 6, price: 11.22 }, { name: "Rune Thread", qty: 1, price: 0.5 }] },
  { name: "Golden Spellthread", category: "Enhancement", profession: "Tailoring", yieldQty: 1, ahPrice: 59.99,
    reagents: [{ name: "Primal Life", qty: 4, price: 10.97 }, { name: "Rune Thread", qty: 1, price: 0.5 }] },

  // Consumables (Engineering)
  { name: "Adamantite Grenade", category: "Consumable", profession: "Engineering", yieldQty: 1, ahPrice: 3.5,
    reagents: [{ name: "Adamantite Bar", qty: 1, price: 2.48 }, { name: "Fel Iron Casing", qty: 1, price: 3.24 }] },
  { name: "Fel Iron Bomb", category: "Consumable", profession: "Engineering", yieldQty: 1, ahPrice: 2.0,
    reagents: [{ name: "Fel Iron Casing", qty: 1, price: 3.24 }, { name: "Handful of Fel Iron Bolts", qty: 2, price: 0.95 }] },
];

export const PROFESSIONS: Profession[] = ["Tailoring", "Blacksmithing", "Leatherworking", "Engineering"];
export const CATEGORIES: Category[] = ["Gear", "Enhancement", "Consumable", "Misc"];

export const PROFESSION_COLORS: Record<Profession, string> = {
  Tailoring: "bg-[hsl(280_55%_45%)]",
  Blacksmithing: "bg-[hsl(0_72%_45%)]",
  Leatherworking: "bg-[hsl(24_60%_40%)]",
  Engineering: "bg-[hsl(48_70%_45%)]",
};

export const CATEGORY_DOT: Record<Category, string> = {
  Gear: "bg-[hsl(214_80%_55%)]",
  Enhancement: "bg-[hsl(280_55%_60%)]",
  Consumable: "bg-[hsl(142_55%_50%)]",
  Misc: "bg-muted-foreground",
};

export const CATEGORY_BADGE: Record<Category, string> = {
  Gear: "bg-[hsl(214_80%_55%)]/10 text-[hsl(214_80%_80%)] border-[hsl(214_80%_55%)]/30",
  Enhancement: "bg-[hsl(280_55%_60%)]/10 text-[hsl(280_55%_85%)] border-[hsl(280_55%_60%)]/30",
  Consumable: "bg-[hsl(142_55%_50%)]/10 text-[hsl(142_55%_80%)] border-[hsl(142_55%_50%)]/30",
  Misc: "bg-muted/30 text-muted-foreground border-border/50",
};
