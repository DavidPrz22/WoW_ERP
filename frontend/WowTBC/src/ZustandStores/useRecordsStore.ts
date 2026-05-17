import { create } from "zustand";
import type { RecordsStore } from "@/features/Records/types/recordsStore";

export const useRecordsStore = create<RecordsStore>((set) => ({
  recordsQuery: "",
  faction: "all",
  showPrices: false,
  priceQuery: "",
  showGold: true,

  dataFaction: "",
  dataRealm: "",
  dataRecordId: "",

  setRecordsQuery: (recordsQuery) => set({ recordsQuery }),
  setFaction: (faction) => set({ faction }),
  setShowPrices: (showPrices) => set({ showPrices }),
  setPriceQuery: (priceQuery) => set({ priceQuery }),
  setShowGold: (showGold) => set({ showGold }),

  setDataFaction: (dataFaction) => set({ dataFaction, dataRealm: "", dataRecordId: "" }),
  setDataRealm: (dataRealm) => set({ dataRealm, dataRecordId: "" }),
  setDataRecordId: (dataRecordId) => set({ dataRecordId }),
}));
