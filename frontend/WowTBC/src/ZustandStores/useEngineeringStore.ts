import { create } from "zustand";
import type { EngineeringStore } from "@/features/Professions/Engineering/types";

export const useEngineeringStore = create<EngineeringStore>((set) => ({
  dataFaction: "",
  dataRealm: "",
  dataRecordId: "",
  partsData: null,
  explosivesData: null,
  buyReagentsToggles: {},
  quantities: {},
  reagentList: null,

  setDataFaction: (dataFaction) => set({ dataFaction, dataRealm: "", dataRecordId: "", partsData: null, explosivesData: null, quantities: {}, reagentList: null }),
  setDataRealm: (dataRealm) => set({ dataRealm, dataRecordId: "", partsData: null, explosivesData: null, quantities: {}, reagentList: null }),
  setDataRecordId: (dataRecordId) => set({ dataRecordId }),
  setPartsData: (partsData) => set({ partsData }),
  setExplosivesData: (explosivesData) => set({ explosivesData }),
  setBuyReagentToggle: (itemName, value) =>
    set((state) => ({
      buyReagentsToggles: { ...state.buyReagentsToggles, [itemName]: value },
    })),
  setQuantities: (quantities) => set({ quantities }),
  setQty: (itemName, qty) =>
    set((state) => ({
      quantities: { ...state.quantities, [itemName]: qty },
    })),
  setReagentList: (reagentList) => set({ reagentList }),
}));
