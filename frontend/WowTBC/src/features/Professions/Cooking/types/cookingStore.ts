import type { CookingGroup } from ".";

export interface CookingStore {
  dataFaction: string;
  dataRealm: string;
  dataRecordId: string;
  cookingGroupsData: CookingGroup[] | null;
  quantities: Record<string, number>;

  setDataFaction: (faction: string) => void;
  setDataRealm: (realm: string) => void;
  setDataRecordId: (recordId: string) => void;
  setCookingGroupsData: (cookingGroupsData: CookingGroup[] | null) => void;
  setQuantities: (qtys: Record<string, number>) => void;
}
