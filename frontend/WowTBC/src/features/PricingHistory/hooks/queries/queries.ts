import { useQuery } from "@tanstack/react-query";
import type { TPricingSearchValues, TPricingHistoryValues } from "../../schemas";

import {
    itemSearchQueryOptions,
    pricingHistoryQueryOptions
} from "./queryOptions";

export const useItemSearch = (params: TPricingSearchValues) => useQuery(itemSearchQueryOptions(params));

export const usePricingHistory = (params: TPricingHistoryValues, enabled: boolean = false) => useQuery(pricingHistoryQueryOptions(params, enabled));
