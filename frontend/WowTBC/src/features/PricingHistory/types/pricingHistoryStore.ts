import type { DateRange } from "react-day-picker";
import type { CompareItem } from "@/features/PricingHistory/types";


export interface PricingHistoryState {
  cls: string;
  sub: string;
  quality: string;
  faction: string;
  realm: string;
  range: DateRange | undefined;
  compareItems: CompareItem[];
}

export interface PricingHistoryActions {
  setCls: (cls: string) => void;
  setSub: (sub: string) => void;
  setQuality: (quality: string) => void;
  setFaction: (faction: string) => void;
  setRealm: (realm: string) => void;
  setRange: (range: DateRange | undefined) => void;
  addCompareItem: (item: CompareItem) => void;
  removeCompareItem: (id: number) => void;
  clearCompareItems: () => void;
}

export type PricingHistoryStore = PricingHistoryState & PricingHistoryActions;
