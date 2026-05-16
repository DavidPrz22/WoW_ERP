export type Override = { value: number; previous: number };

export interface RecordsStore {
  recordsQuery: string;
  faction: string;
  showPrices: boolean;
  priceQuery: string;
  showGold: boolean;
  overrides: Record<string, Override>;
  
  // Selection state for RecordSelects
  dataFaction: string;
  dataRealm: string;
  dataRecordId: string;

  setRecordsQuery: (query: string) => void;
  setFaction: (faction: string) => void;
  setShowPrices: (show: boolean) => void;
  setPriceQuery: (query: string) => void;
  setShowGold: (show: boolean) => void;
  setOverride: (key: string, value: number, previous: number) => void;
  removeOverride: (key: string) => void;
  
  setDataFaction: (faction: string) => void;
  setDataRealm: (realm: string) => void;
  setDataRecordId: (recordId: string) => void;
}
