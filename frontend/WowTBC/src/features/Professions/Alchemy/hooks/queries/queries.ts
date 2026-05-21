import { useQuery, queryOptions, keepPreviousData } from '@tanstack/react-query';
import { fetchItemSearch } from '../../api';
import type { TItemSearchParams } from '../../types/index';

export const itemSearchQueryOptions = (params: TItemSearchParams) => queryOptions({
    queryKey: ['item-search-group', params],
    queryFn: () => fetchItemSearch(params),
    enabled: !!params.searchTerm, // Only fetch if there is a search term
    staleTime: Infinity, //
    placeholderData: keepPreviousData,
});

export const useItemSearch = (params: TItemSearchParams) => useQuery(itemSearchQueryOptions(params));
