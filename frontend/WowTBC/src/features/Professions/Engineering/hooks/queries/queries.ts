import { useQuery } from '@tanstack/react-query';
import { engineeringDataQueryOptions } from './queryOptions';
import type { TEngineeringDataQueryParams } from '../../types';

export const useEngineeringData = (params: TEngineeringDataQueryParams) =>
  useQuery(engineeringDataQueryOptions(params));
