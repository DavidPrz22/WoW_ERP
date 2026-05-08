import { create } from "zustand";
import type { PricingHistoryStore } from "@/features/PricingHistory/types/pricingHistoryStore";
import { items } from "@/data/mock";

export const usePricingHistoryStore = create<PricingHistoryStore>((set) => ({
  selected: items[5],
  cls: "",
  sub: "",
  quality: "",
  faction: "",
  realm: "",
  range: undefined,
  setSelected: (selected) => set({ selected }),
  setCls: (cls) => set({ cls }),
  setSub: (sub) => set({ sub }),
  setQuality: (quality) => set({ quality }),
  setFaction: (faction) => set({ faction }),
  setRealm: (realm) => set({ realm }),
  setRange: (range) => set({ range }),
}));
