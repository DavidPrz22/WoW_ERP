import type { Item } from "@/data/mock";

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

export interface PricingChartProps {
  history: {
    date: string;
    marketValue: number;
    minBuyout: number;
    historical: number;
    numAuctions: number;
  }[];
}
