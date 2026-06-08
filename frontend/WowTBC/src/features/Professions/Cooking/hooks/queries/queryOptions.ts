import { queryOptions } from '@tanstack/react-query';
import { getCookingGroupsData } from '../../api';
import { type TGetCookingGroupsDataParams, GetCookingGroupsDataSchema } from '@/schemas/schemas';

export const COOKING_GROUP_DATA = 'cooking-group-data';

export const cookingGroupDataQueryOptions = (params: TGetCookingGroupsDataParams) => {
  const parsedParams = GetCookingGroupsDataSchema.safeParse(params);
  return queryOptions({
    queryKey: [COOKING_GROUP_DATA, { realm: params.realm, faction: params.faction, record: params.selected_record }],
    queryFn: () => getCookingGroupsData(params),
    enabled: !!parsedParams.success,
    staleTime: Infinity,
  });
};
