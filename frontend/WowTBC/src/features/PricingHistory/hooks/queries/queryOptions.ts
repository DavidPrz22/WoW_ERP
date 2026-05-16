import { queryOptions } from "@tanstack/react-query";
import { searchItems, fetchPricingHistory } from "../../api";
import type { TPricingSearchValues, TPricingHistoryValues } from "../../schemas";
export const itemSearchQueryOptions = (params: TPricingSearchValues) => queryOptions({
    queryKey: ['items-search', params],
    queryFn: () => searchItems(params),
    enabled: params.searchTerm.length >= 2,
    placeholderData: (prev) => prev
});

export const pricingHistoryQueryOptions = (params: TPricingHistoryValues, enabled: boolean = false) => queryOptions({
    queryKey: ['pricing-history', params],
    queryFn: () => fetchPricingHistory(params),
    enabled: enabled && !!params.item_id
});
