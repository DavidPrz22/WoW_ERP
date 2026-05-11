import { queryOptions } from "@tanstack/react-query";
import {
    fetchClassSubclass,
    fetchQuality,
    fetchFaction,
    fetchRealm,
    searchItems,
    fetchPricingHistory
} from "../../api";
import type { TPricingSearchValues, TPricingHistoryValues } from "../../schemas";

export const classSubclassQueryOptions = () => queryOptions({
    queryKey: ['class-subclass'],
    queryFn: fetchClassSubclass,
    staleTime: Infinity
});

export const qualityQueryOptions = () => queryOptions({
    queryKey: ['quality'],
    queryFn: fetchQuality,
    staleTime: Infinity
});

export const factionQueryOptions = () => queryOptions({
    queryKey: ['faction'],
    queryFn: fetchFaction,
    staleTime: Infinity
});

export const realmQueryOptions = () => queryOptions({
    queryKey: ['realm'],
    queryFn: fetchRealm,
    staleTime: Infinity
});

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
