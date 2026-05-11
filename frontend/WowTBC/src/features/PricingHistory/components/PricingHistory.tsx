import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useItemSearch, usePricingHistory } from "../hooks/queries/queries";
import type { TPricingSearchValues, TPricingHistoryValues } from "../schemas";
import { PricingSearchValuesSchema } from "../schemas";
import { PricingFilters } from "./PricingFilters";
import { PricingChart } from "./PricingChart";
import type { Item } from "../types";
import { useWatch } from "react-hook-form";
import { useDebounce } from "@/hooks/useDebounce";

export function PricingHistory() {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // State for triggering queries

  const [activeHistoryParams, setActiveHistoryParams] = useState<TPricingHistoryValues | null>(null);

  const searchForm = useForm<TPricingSearchValues>({
    resolver: zodResolver(PricingSearchValuesSchema),
    defaultValues: {
      searchTerm: "",
      class: "all",
      subclass: "all",
      quality: "all"
    },
  });

  const historyForm = useForm<any>({
    defaultValues: {
      item_id: undefined,
      faction_id: undefined,
      realm_id: undefined,
      range: undefined,
    },
  });

  const searchTerm = useWatch({ control: searchForm.control, name: "searchTerm" });
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const classVal = useWatch({ control: searchForm.control, name: "class" });
  const subclassVal = useWatch({ control: searchForm.control, name: "subclass" });
  const qualityVal = useWatch({ control: searchForm.control, name: "quality" });

  const searchParams = {
    searchTerm: debouncedSearchTerm,
    class: classVal,
    subclass: subclassVal,
    quality: qualityVal
  };
  const { handleSubmit: searchHandleSubmit } = searchForm;
  const { handleSubmit: historyHandleSubmit } = historyForm;

  const onSearchSubmit = (data: TPricingSearchValues) => {
    console.log(data);
  };

  const onHistorySubmit = (data: any) => {
    console.log(data);
    const formattedData: TPricingHistoryValues = {
      item_id: data.item_id,
      faction_id: data.faction_id,
      realm_id: data.realm_id,
      from_date: data.range?.from?.toISOString(),
      to_date: data.range?.to?.toISOString(),
    };
    setActiveHistoryParams(formattedData);
  };

  const wrappedSearchSubmit = searchHandleSubmit(onSearchSubmit);
  const wrappedHistorySubmit = historyHandleSubmit(onHistorySubmit);

  // Trigger search on explicit submit or change if needed
  const { data: suggestions = [] } = useItemSearch(searchParams as TPricingSearchValues);

  const { data: history = [] } = usePricingHistory(
    activeHistoryParams!,
    !!activeHistoryParams
  );

  const lastRecord = history.length > 0 ? history[history.length - 1] : undefined;

  return (
    <div className="px-6 md:px-12 py-10 space-y-6">
      <div>
        <h1 className="font-display text-4xl text-gold">Pricing History</h1>
        <p className="text-muted-foreground text-sm">Explore item prices and market trends across realms.</p>
      </div>

      <PricingFilters
        searchControl={searchForm.control}
        historyControl={historyForm.control}
        onSearchSubmit={wrappedSearchSubmit}
        open={open}
        setOpen={setOpen}
        suggestions={suggestions}
        onSelect={(item: Item) => {
          setSelectedItem(item);
          historyForm.setValue("item_id", item.id_ingame);
          setOpen(false);
          wrappedHistorySubmit();
        }}
        setSubclass={(value: string) => {
          searchForm.setValue("subclass", value);
        }}
      />

      {selectedItem && lastRecord && (
        <div className="grid gap-6 lg:grid-cols-3">
           <PricingChart history={history} />
        </div>
      )}
    </div>
  );
}
