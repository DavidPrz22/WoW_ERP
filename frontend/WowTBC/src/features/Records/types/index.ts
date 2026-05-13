export interface ItemRecord {
  id: number;
  item_id: string;
  item_name: string;
  market_value: number;
  min_buyout: number;
  num_auctions: number;
  historical: boolean;
  timestamp: string;
  realm_name: string;
  faction: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SystemRecord {
  id: number;
  realm_name: string;
  faction: string;
  item_count: number;
  timestamp: string;
}
