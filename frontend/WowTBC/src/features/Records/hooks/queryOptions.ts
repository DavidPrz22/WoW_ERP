import { queryOptions } from "@tanstack/react-query";
import { getRecords, getRecordData } from "../api";
import { type TGetRecordDataParams, type TGetRecordsParams } from '../schemas';
import { GetRecordsSchema, GetRecordDataSchema } from "../schemas";

export const recordsQueryOptions = (params: Partial<TGetRecordsParams>) => {
  const result = GetRecordsSchema.safeParse(params);
  return queryOptions({
    queryKey: ["records", result.data?.realm, result.data?.faction, result.data?.page],
    queryFn: () => getRecords(result.data!),
    enabled: result.success,
    staleTime: Infinity
  });
};

export const recordDataQueryOptions = (params: Partial<TGetRecordDataParams>) => {
  const result = GetRecordDataSchema.safeParse(params);
  return queryOptions({
    queryKey: ["recordData", result.data?.realm, result.data?.faction, result.data?.selected_record],
    queryFn: () => getRecordData(result.data!),
    enabled: result.success,
    staleTime: Infinity
  });
};
