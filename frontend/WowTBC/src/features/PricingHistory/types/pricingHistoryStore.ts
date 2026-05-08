import type { Item } from "@/data/mock";
import type { DateRange } from "react-day-picker";

export interface PricingHistoryState {
  selected: Item;
  cls: string;
  sub: string;
  quality: string;
  faction: string;
  realm: string;
  range: DateRange | undefined;
}

export interface PricingHistoryActions {
  setSelected: (item: Item) => void;
  setCls: (cls: string) => void;
  setSub: (sub: string) => void;
  setQuality: (quality: string) => void;
  setFaction: (faction: string) => void;
  setRealm: (realm: string) => void;
  setRange: (range: DateRange | undefined) => void;
}

export type PricingHistoryStore = PricingHistoryState & PricingHistoryActions;
