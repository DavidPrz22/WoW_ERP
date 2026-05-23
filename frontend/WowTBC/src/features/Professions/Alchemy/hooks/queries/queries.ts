import { useQuery} from '@tanstack/react-query';
import type { TItemSearchParams } from '../../types/index';
import { itemSearchQueryOptions } from './queryOptions';

export const useItemSearch = (params: TItemSearchParams) => useQuery(itemSearchQueryOptions(params));

