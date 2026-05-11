import { type Control } from "react-hook-form";
import type { TPricingSearchValues } from "../schemas";
import { SearchFilters } from "./SearchFilters";
import { HistoryFilters } from "./HistoryFilters";

export interface PricingFiltersProps {
  searchControl: Control<TPricingSearchValues>;
  historyControl: Control<any>;
  open: boolean;
  setOpen: (o: boolean) => void;
  suggestions: any[];
  onSelect: (item: any) => void;
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
