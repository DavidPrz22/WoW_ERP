import { getRecords, type GetRecordsParams } from "../api";

export const recordsQueryOptions = (params: GetRecordsParams)=> ({
  queryKey: ['records', params],
  queryFn: () => getRecords(params),
  keepPreviousData: true,
});