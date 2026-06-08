import { queryOptions } from '@tanstack/react-query';
import { getEngineeringData } from '../../api';
import { EngineeringDataQuerySchema } from '../../schemas/schemas';
import type { TEngineeringDataQueryParams } from '../../types';

export const ENGINEERING_DATA = 'engineering-data';

export const engineeringDataQueryOptions = (params: TEngineeringDataQueryParams) => {
  const parsedParams = EngineeringDataQuerySchema.safeParse({
    ...params,
    record_id: params.record_id ? Number(params.record_id) : undefined,
  });

  return queryOptions({
    queryKey: [ENGINEERING_DATA, { realm: params.realm, faction: params.faction, record_id: params.record_id }],
    queryFn: () => getEngineeringData({
      realm: params.realm,
      faction: params.faction,
      record_id: Number(params.record_id),
    }),
    enabled: parsedParams.success,
    staleTime: Infinity,
  });
};
