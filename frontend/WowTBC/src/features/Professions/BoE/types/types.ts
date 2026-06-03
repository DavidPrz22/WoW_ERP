export type Reagent = { name: string; qty: number; price: number; isNether?: "primal" | "vortex" };
export type Category = "Enhancement" | "Consumable" | "Gear" | "Misc";
export type Profession = "Tailoring" | "Blacksmithing" | "Leatherworking" | "Engineering";

export type NetherPrices = { primal: number; vortex: number };

export type BoeItem = {
  name: string;
  category: Category;
  profession: Profession;
  yieldQty: number;
  ahPrice: number;
  reagents: Reagent[];
};

export type BoeItemMetrics = {
  cost: number;
  breakeven: number;
  profit: number;
  roi: number;
  hasAhPrice: boolean;
};
