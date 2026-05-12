import { create } from "zustand";
import type { PricingHistoryStore } from "@/features/PricingHistory/types/pricingHistoryStore";

export const usePricingHistoryStore = create<PricingHistoryStore>((set) => ({
  cls: "",
  sub: "",
  quality: "",
  faction: "",
  realm: "",
  range: undefined,
  compareItems: [],
  setCls: (cls) => set({ cls }),
  setSub: (sub) => set({ sub }),
  setQuality: (quality) => set({ quality }),
  setFaction: (faction) => set({ faction }),
  setRealm: (realm) => set({ realm }),
  setRange: (range) => set({ range }),
  addCompareItem: (item) => set((state) => ({ 
    compareItems: [...state.compareItems.filter(i => i.id !== item.id), item] 
  })),
  removeCompareItem: (id) => set((state) => ({ 
    compareItems: state.compareItems.filter((i) => i.id !== id) 
  })),
  clearCompareItems: () => set({ compareItems: [] }),
}));
