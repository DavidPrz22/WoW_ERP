export type JewelcraftingRawGem = {
  name: string;
  procChance: number;
  vendorPrice: number;
  ahPrice: number | null;
};

export type JewelcraftingCutGem = {
  name: string;
  color: string;
  rawGem: string;
  craftingCost: number;
  ahPrice: number | null;
};

export type JewelcraftingItemsResponse = {
  raw_gems: JewelcraftingRawGem[];
  cut_gems: JewelcraftingCutGem[];
};
