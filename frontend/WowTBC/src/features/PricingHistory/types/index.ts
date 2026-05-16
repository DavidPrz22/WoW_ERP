import type { Quality } from "@/types/types";


export type ItemSearchResult = {
  id_ingame: string;
  name: string;
  quality: Quality;
  icon: string;
  itemClass: string;
  subClass: string;
};


export interface CompareItem {
  id: string;
  name: string;
  icon: string;
  quality: Quality;
  chartData: TPricingHistoryRecord[];
}


export interface PricingFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  suggestions: ItemSearchResult[];
  subOptions: string[];
}


export interface ItemDetailsCardProps {
  selected: ItemSearchResult;
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

