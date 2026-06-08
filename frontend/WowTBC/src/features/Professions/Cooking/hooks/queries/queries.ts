import { useQuery } from '@tanstack/react-query';
import type { TGetCookingGroupsDataParams } from '@/schemas/schemas';
import { cookingGroupDataQueryOptions } from './queryOptions';

export const useCookingGroupData = (params: TGetCookingGroupsDataParams) =>
  useQuery(cookingGroupDataQueryOptions(params));
