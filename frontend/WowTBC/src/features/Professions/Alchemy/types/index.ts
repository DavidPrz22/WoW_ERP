export type AlchemyItemCalculation = {
  name: string;
  AHPrice: number;
  craftingCost: number;
  breakeven: number;
  profitPerItem: number;
  ROI: number;
};
export type RowState = { ahPrice: number; qty: number };

export type DraftRow = { id: number; name: string; ahPrice: number; qty: number };

export type TItemSearchParams = {
  searchTerm?: string;
  class?: string;
  subclass?: string;
  quality?: string;
};

export type TItemSearchResponse = {
  id: number;
  id_ingame: number;
  name: string;
  icon: string;
  quality: string;
  itemClass: string;
  subClass: string;
};

export type TCreateAlchemyItemPayload = {
  group: string;
  item_id: number;
};


export type AlchemyGroup = {
  group: "Flasks" | "Elixirs" | "Potions";
  items: AlchemyItemCalculation[];
  search_group: "Flask" | "Elixir" | "Potion";
};

export type AlchemyCalculationsResponse = {
  groups_data: AlchemyGroup[];
  total_reagents_used: Record<string, number>;
};
