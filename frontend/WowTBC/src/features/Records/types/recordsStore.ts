export type Override = { value: number; previous: number };

export interface RecordsStore {
  recordsQuery: string;
  faction: string;
  showPrices: boolean;
  priceQuery: string;
  showGold: boolean;
  overrides: Record<string, Override>;
  setRecordsQuery: (query: string) => void;
  setFaction: (faction: string) => void;
  setShowPrices: (show: boolean) => void;
  setPriceQuery: (query: string) => void;
  setShowGold: (show: boolean) => void;
  setOverride: (key: string, value: number, previous: number) => void;
  removeOverride: (key: string) => void;
}
