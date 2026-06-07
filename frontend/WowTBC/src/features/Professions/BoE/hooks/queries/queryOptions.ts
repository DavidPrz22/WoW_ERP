import { queryOptions } from '@tanstack/react-query';
import { getBoeData } from '../../api/api';
import { BoeDataQuerySchema } from '../../schemas/schemas';

export const BOE_DATA = 'boe-data';

export const boeDataQueryOptions = (params: { realm: string; faction: string; record_id: number }) => {
  const parsedParams = BoeDataQuerySchema.safeParse(params);
  return queryOptions({
    queryKey: [BOE_DATA, { realm: params.realm, faction: params.faction, record_id: params.record_id }],
    queryFn: () => getBoeData(params),
    enabled: parsedParams.success,
    staleTime: Infinity,
  });
};
