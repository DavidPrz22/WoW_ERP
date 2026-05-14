import { type Control } from "react-hook-form";
import type { TPricingSearchValues, TPricingHistoryInput } from "../schemas";
import { SearchFilters } from "./SearchFilters";
import { HistoryFilters } from "./HistoryFilters";
import type { ItemSearchResult} from "../types";

export interface PricingFiltersProps {
  searchControl: Control<TPricingSearchValues>;
  historyControl: Control<TPricingHistoryInput>;
  open: boolean;
  setOpen: (o: boolean) => void;
  suggestions: ItemSearchResult[];
  onSelect: (item: ItemSearchResult) => void;
  onSearchSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  setSubclass: (value: string) => void;
}

export function PricingFilters({
  searchControl,
  historyControl,
  open, 
  setOpen, 
  suggestions, 
  onSelect,
  onSearchSubmit,
  setSubclass
}: PricingFiltersProps) {
  return (
    <div className="space-y-4">
      <SearchFilters 
        control={searchControl}
        onSubmit={onSearchSubmit}
        open={open}
        setOpen={setOpen}
        suggestions={suggestions}
        onSelect={onSelect}
        setSubclass={setSubclass}
      />
      <HistoryFilters 
        control={historyControl}
      />
    </div>
  );
}
