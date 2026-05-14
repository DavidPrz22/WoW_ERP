import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useItemSearch } from "../hooks/queries/queries";
import { useQueryClient } from "@tanstack/react-query";
import type { TPricingSearchValues, TPricingHistoryValues, TPricingHistoryInput } from "../schemas";
import { PricingSearchValuesSchema, PricingHistorySchema } from "../schemas";
import { PricingFilters } from "./PricingFilters";
import { PricingChart } from "./PricingChart";
import type { ItemSearchResult } from "../types";

import { useDebounce } from "@/hooks/useDebounce";
import { usePricingHistoryStore } from "@/ZustandStores/usePricingHistoryStore";
import { CompareItemSection } from "./CompareItemSection";
import { pricingHistoryQueryOptions } from "../hooks/queries/queryOptions";

export function PricingHistory() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { 
    compareItems, 
    addCompareItem, 
    removeCompareItem 
  } = usePricingHistoryStore();

  console.log("compareItems",compareItems);

  const searchForm = useForm<TPricingSearchValues>({
    resolver: zodResolver(PricingSearchValuesSchema),
    defaultValues: {
      searchTerm: "",
      class: "all",
      subclass: "all",
      quality: "all"
    },
  });

  const historyForm = useForm<TPricingHistoryInput, undefined, TPricingHistoryValues>({
    resolver: zodResolver(PricingHistorySchema),
    defaultValues: {
      item_id: undefined,
      faction: 'Alliance',
      realm: 'Nightslayer',
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

  const onHistorySubmit = async (data: TPricingHistoryValues) => {
      console.log(data);
      const historyData = await queryClient.fetchQuery(pricingHistoryQueryOptions(data, true));

      addCompareItem({
        id: historyData.id,
        name: historyData.name,
        icon: historyData.icon,
        quality: historyData.quality,
        chartData: historyData.chartData
      });
  };

  const wrappedSearchSubmit = searchHandleSubmit(onSearchSubmit);
  const wrappedHistorySubmit = historyHandleSubmit(onHistorySubmit);

  const { data: suggestions = [] } = useItemSearch(searchParams as TPricingSearchValues);

  return (
    <div className="px-6 md:px-12 py-10 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-4xl text-gold">Pricing History</h1>
          <p className="text-muted-foreground text-sm">Explore item prices and market trends across realms.</p>
        </div>
      </div>

      <PricingFilters
        searchControl={searchForm.control}
        historyControl={historyForm.control}
        onSearchSubmit={wrappedSearchSubmit}
        open={open}
        setOpen={setOpen}
        suggestions={suggestions}
        onSelect={(item: ItemSearchResult) => {
          historyForm.setValue("item_id", item.id_ingame);
          setOpen(false);
          wrappedHistorySubmit();
        }}
        setSubclass={(value: string) => {
          searchForm.setValue("subclass", value);
        }}
      />

      {compareItems.length > 0 && (
        <CompareItemSection bucket={compareItems} removeItem={removeCompareItem} />
      )}

      {compareItems.length > 0 ? (
        <PricingChart compareItems={compareItems} />
      ) : null}
    </div>
  );
}
