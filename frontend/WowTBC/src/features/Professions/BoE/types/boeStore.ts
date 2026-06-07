import type { BoeApiProfession } from "../types/types";

export interface BoeStore {
  dataFaction: string;
  dataRealm: string;
  dataRecordId: string;
  boeData: BoeApiProfession[] | null;

  setDataFaction: (faction: string) => void;
  setDataRealm: (realm: string) => void;
  setDataRecordId: (recordId: string) => void;
  setBoeData: (data: BoeApiProfession[] | null) => void;
}
