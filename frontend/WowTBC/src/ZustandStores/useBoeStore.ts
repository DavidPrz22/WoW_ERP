import { create } from "zustand";
import type { BoeStore } from "@/features/Professions/BoE/types/boeStore";

export const useBoeStore = create<BoeStore>((set) => ({
  dataFaction: "",
  dataRealm: "",
  dataRecordId: "",

  setDataFaction: (dataFaction) => set({ dataFaction, dataRealm: "", dataRecordId: "" }),
  setDataRealm: (dataRealm) => set({ dataRealm, dataRecordId: "" }),
  setDataRecordId: (dataRecordId) => set({ dataRecordId }),
}));
