import { useQuery} from '@tanstack/react-query';
import type { TItemSearchParams } from '../../types/index';
import type { TGetRecordDataParams } from '@/schemas/schemas';
import { alchemyGroupDataQueryOptions, itemSearchQueryOptions } from './queryOptions';

export const useItemSearch = (params: TItemSearchParams) => useQuery(itemSearchQueryOptions(params));

export const useAlchemyGroupData = (params: TGetRecordDataParams) => useQuery(alchemyGroupDataQueryOptions(params));