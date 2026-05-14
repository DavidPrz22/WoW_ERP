import { useQuery } from '@tanstack/react-query';
import { recordsQueryOptions } from './queryOptions';
import type { GetRecordsParams } from '../api';

export const useRecordsQuery = (params: GetRecordsParams) => {
  return useQuery(recordsQueryOptions(params));
};
