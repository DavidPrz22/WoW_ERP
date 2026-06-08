export type CookingType =
  | "Agility"
  | "Spell power"
  | "Stamina"
  | "Strength"
  | "Healing"
  | "Hit Rating"
  | "Pet Buff"
  | "Other";

export type CookingReagent = {
  id_ingame: string;
  name: string;
  qty: number;
  min_buyout: number | null;
  overriden_min_buyout: number | null;
};

export type CookingItemCalculation = {
  name: string;
  id_ingame: string;
  type: CookingType;
  yield_quantity: number;
  AHPrice: number;
  craftingCost: number;
};

export type CookingGroup = {
  type: CookingType;
  items: CookingItemCalculation[];
};

export type CookingReagentsByType = Record<string, Record<string, CookingReagent[]>>;

export type CookingCalculationsResponse = {
  groups_data: CookingGroup[];
  total_reagents_used: CookingReagentsByType;
};

export type TGetCookingGroupsDataParams = {
  faction: string;
  realm: string;
  selected_record: string;
};

export type CookingGroupTableRow = {
  item: CookingItemCalculation;
  qty: number;
  totalCost: number;
  expected: number;
  breakeven: number;
  profitPerItem: number;
  ROI: number;
};
