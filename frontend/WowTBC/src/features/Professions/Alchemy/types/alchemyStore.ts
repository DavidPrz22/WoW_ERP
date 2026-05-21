export interface AlchemyStore {
  // Selection state for RecordSelects
  dataFaction: string;
  dataRealm: string;
  dataRecordId: string;
  setDataFaction: (faction: string) => void;
  setDataRealm: (realm: string) => void;
  setDataRecordId: (recordId: string) => void;
}
