import { create } from "zustand";
import type { RecordsStore } from "@/features/Records/types/recordsStore";

export const useRecordsStore = create<RecordsStore>((set) => ({
  recordsQuery: "",
  faction: "all",
  showPrices: false,
  priceQuery: "",
  showGold: true,
  overrides: {},

  dataFaction: "",
  dataRealm: "",
  dataRecordId: "",

  setRecordsQuery: (recordsQuery) => set({ recordsQuery }),
  setFaction: (faction) => set({ faction }),
  setShowPrices: (showPrices) => set({ showPrices }),
  setPriceQuery: (priceQuery) => set({ priceQuery }),
  setShowGold: (showGold) => set({ showGold }),
  setOverride: (key, value, previous) =>
    set((state) => ({
      overrides: {
        ...state.overrides,
        [key]: { value, previous },
      },
    })),
  removeOverride: (key) =>
    set((state) => {
      const newOverrides = { ...state.overrides };
      delete newOverrides[key];
      return { overrides: newOverrides };
    }),

  setDataFaction: (dataFaction) => set({ dataFaction, dataRealm: "", dataRecordId: "" }),
  setDataRealm: (dataRealm) => set({ dataRealm, dataRecordId: "" }),
  setDataRecordId: (dataRecordId) => set({ dataRecordId }),
}));
