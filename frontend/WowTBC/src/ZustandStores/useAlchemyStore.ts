import { create } from "zustand";
import type { AlchemyStore } from "@/features/Professions/Alchemy/types/alchemyStore";

export const useAlchemyStore = create<AlchemyStore>((set) => ({
  dataFaction: "",
  dataRealm: "",
  dataRecordId: "",
  alchemyGroupsData: null,

  setDataFaction: (dataFaction) => set({ dataFaction, dataRealm: "", dataRecordId: "" }),
  setDataRealm: (dataRealm) => set({ dataRealm, dataRecordId: "" }),
  setDataRecordId: (dataRecordId) => set({ dataRecordId }),
  setAlchemyGroupsData: (groupsData) => set({ alchemyGroupsData: groupsData }),
}));
