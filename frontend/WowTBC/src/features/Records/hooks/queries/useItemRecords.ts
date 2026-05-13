import { useQuery } from '@tanstack/react-query';
import { getRecords, type GetRecordsParams } from '../../api/getRecords';

export const useItemRecords = (params: GetRecordsParams) => {
  return useQuery({
    queryKey: ['item-records', params],
    queryFn: () => getRecords(params),
  });
};
