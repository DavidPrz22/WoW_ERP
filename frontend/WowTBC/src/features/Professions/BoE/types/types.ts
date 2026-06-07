export type Reagent = { name: string; qty: number; price: number; isNether?: "primal" | "vortex" };
export type Category = "Enhancement" | "Consumable" | "Gear" | "Misc";
export type Profession = "Tailoring" | "Blacksmithing" | "Leatherworking" | "Engineering";

export type NetherPrices = { primal: number; vortex: number };
export type NetherInput = "primal" | "vortex";

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
  ahPrice: number;
};

export type BoeApiReagent = {
  id: number;
  name: string;
  quantity: number;
  min_buyout: number | null;
  overriden_min_buyout: number | null;
  is_nether_input: NetherInput | null;
};

export type BoeApiItem = {
  name: string;
  min_buyout: number | null;
  overriden_min_buyout: number | null;
  yield_quantity: number;
  reagents: BoeApiReagent[];
};

export type BoeApiCategory = {
  category: Category;
  items: BoeApiItem[];
};

export type BoeApiProfession = {
  profession: Profession;
  items: BoeApiCategory[];
};

export type BoeApiResponse = BoeApiProfession[];

export interface BoeApiDataResponse {
  data: BoeApiResponse;
}
