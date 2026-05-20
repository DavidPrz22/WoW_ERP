export type Recipe = {
  name: string;
  reagents: { name: string; qty: number }[];
  yieldPerCraft?: number;
  defaultAHPrice: number;
  defaultQty: number;
};

export type Group = { 
  key: "Flasks" | "Elixirs" | "Potions"; 
  title: string; 
  recipes: Recipe[];
  searchGroup?: "Flask" | "Elixir" | "Potion";
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
