import { useQuery } from '@tanstack/react-query';
import { engineeringDataQueryOptions } from './queryOptions';
import type { TEngineeringDataQueryParams } from '../../schemas/schemas';

export const useEngineeringData = (params: TEngineeringDataQueryParams) =>
  useQuery(engineeringDataQueryOptions(params));
