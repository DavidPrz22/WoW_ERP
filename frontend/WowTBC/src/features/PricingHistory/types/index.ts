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

export interface CompareItem {
  id: number;
  name: string;
  icon: string;
  quality: string;
  chartData: TPricingHistoryRecord[];
}

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
  compareItems?: CompareItem[];
}
