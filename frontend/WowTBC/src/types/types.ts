export type Faction = "Horde" | "Alliance";
export type Quality = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export interface TItemSubclass {
  id: number;
  name: string;
}

export interface TItemClass {
  id: number;
  name: string;
  subclasses: TItemSubclass[];
}

export interface TRealm {
  realm_name: string;
}