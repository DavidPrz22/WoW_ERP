import { create } from "zustand";
import type { CookingStore } from "@/features/Professions/Cooking/types/cookingStore";

export const useCookingStore = create<CookingStore>((set) => ({
  dataFaction: "",
  dataRealm: "",
  dataRecordId: "",
  cookingGroupsData: null,
  quantities: {},

  setDataFaction: (dataFaction) => set({ dataFaction, dataRealm: "", dataRecordId: "" }),
  setDataRealm: (dataRealm) => set({ dataRealm, dataRecordId: "" }),
  setDataRecordId: (dataRecordId) => set({ dataRecordId }),
  setCookingGroupsData: (groupsData) => set({ cookingGroupsData: groupsData }),
  setQuantities: (qtys) => set({ quantities: qtys }),
}));
