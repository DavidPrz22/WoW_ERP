import { useQuery } from "@tanstack/react-query";
import type { TPricingSearchValues, TPricingHistoryValues } from "../../schemas";

import {
    classSubclassQueryOptions,
    qualityQueryOptions,
    factionQueryOptions,
    realmQueryOptions,
    itemSearchQueryOptions,
    pricingHistoryQueryOptions
} from "./queryOptions";

export const useClassSubclass = () => useQuery(classSubclassQueryOptions());

export const useQualityOptions = () => useQuery(qualityQueryOptions());

export const useFactionOptions = () => useQuery(factionQueryOptions());

export const useRealmOptions = () => useQuery(realmQueryOptions());

export const useItemSearch = (params: TPricingSearchValues) => useQuery(itemSearchQueryOptions(params));

export const usePricingHistory = (params: TPricingHistoryValues, enabled: boolean = false) => useQuery(pricingHistoryQueryOptions(params, enabled));
