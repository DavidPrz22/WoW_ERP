import { queryOptions } from "@tanstack/react-query";
import { getRecords, getRecordData } from "../api";
import { type TGetRecordDataParams, type TGetRecordsParams, type TGetRecordsSelectParams } from '../schemas';
import { GetRecordsSchema, GetRecordsSelectSchema, GetRecordDataSchema } from "../schemas";

export const recordsQueryOptions = (params: Partial<TGetRecordsParams>) => {
  const result = GetRecordsSchema.safeParse(params);
  return queryOptions({
    queryKey: ["records", result.data?.realm, result.data?.faction, result.data?.page],
    queryFn: () => getRecords(result.data!),
    enabled: result.success,
    staleTime: Infinity
  });
};

export const recordsSelectQueryOptions = (params: TGetRecordsSelectParams) => {
  const result = GetRecordsSelectSchema.safeParse(params);
  return queryOptions({
    queryKey: ["records_select", result.data?.realm, result.data?.faction],
    queryFn: () => getRecords(result.data),
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
