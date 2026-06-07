import { useQuery } from '@tanstack/react-query';
import { boeDataQueryOptions } from './queryOptions';

export const useBoeData = (params: { realm: string; faction: string; record_id: number }) => {
  return useQuery(boeDataQueryOptions(params));
};
