import { queryOptions, keepPreviousData } from '@tanstack/react-query';
import { fetchItemSearch, getAlchemyGroupsData } from '../../api';
import { type TGetRecordDataParams, GetRecordDataSchema } from '@/schemas/schemas';
import type { TItemSearchParams } from '../../types/index';

export const itemSearchQueryOptions = (params: TItemSearchParams) => queryOptions({
    queryKey: ['item-search-group', params],
    queryFn: () => fetchItemSearch(params),
    enabled: !!params.searchTerm, // Only fetch if there is a search term
    staleTime: Infinity, //
    placeholderData: keepPreviousData,
});


export const ALCHEMY_GROUP_DATA = 'alchemy-group-data';
export const alchemyGroupDataQueryOptions = (params: TGetRecordDataParams) => {
    const parsedParams = GetRecordDataSchema.safeParse(params);
    return queryOptions({
        queryKey: [ALCHEMY_GROUP_DATA, { realm: params.realm, faction: params.faction, record: params.selected_record }],
        queryFn: () => getAlchemyGroupsData(params),
        enabled: !!parsedParams.success, // Only fetch if there is a valid groupId
        staleTime: Infinity, // Data doesn't change often, so we can keep it fresh indefinitely
        })
    };