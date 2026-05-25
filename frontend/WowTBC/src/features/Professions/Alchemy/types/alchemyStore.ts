import type { AlchemyGroup } from ".";



export interface AlchemyStore {
  // Selection state for RecordSelects
  dataFaction: string;
  dataRealm: string;
  dataRecordId: string;
  alchemyGroupsData: AlchemyGroup[] | null;

  setDataFaction: (faction: string) => void;
  setDataRealm: (realm: string) => void;
  setDataRecordId: (recordId: string) => void;
  setAlchemyGroupsData: (alchemyGroupsData: AlchemyGroup[] | null) => void;
}
