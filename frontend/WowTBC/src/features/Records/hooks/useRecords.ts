import { useQuery } from '@tanstack/react-query';
import { getRecords } from '../api/getRecords';
import type { GetRecordsParams } from '../api/getRecords';

export const useRecordsQuery = (params: GetRecordsParams) => {
  return useQuery({
    queryKey: ['records', params],
    queryFn: () => getRecords(params),
    keepPreviousData: true,
  });
};
