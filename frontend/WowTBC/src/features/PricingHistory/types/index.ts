export type Item = {
  id: number;
  icon: string;
  name: string;
  itemClass: string;
  subClass: string;
  quality: string;
  id_ingame: string;
  vendor_sell_price: number;
};

export interface PricingFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  suggestions: Item[];
  subOptions: string[];
}

export interface ItemDetailsCardProps {
  selected: Item;
  lastRecord: {
    marketValue: number;
    minBuyout: number;
    historical: number;
    numAuctions: number;
  };
}

export interface TPricingHistoryRecord {
  date: string;
  marketValue: number;
  minBuyout: number;
  historical: number;
  numAuctions: number;
}

export interface PricingChartProps {
  history: TPricingHistoryRecord[];
}

export type SearchItemsParams = {
  searchterm: string;
  class?: string;
  subclass?: string;
  quality?: string;
};

export type PricingHistoryParams = {
  item_id: string;
  faction_id: string;
  realm_id: number;
  from_date?: string;
  to_date?: string;
};

