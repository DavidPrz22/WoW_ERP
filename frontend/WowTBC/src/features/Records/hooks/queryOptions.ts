import { queryOptions } from "@tanstack/react-query";
import { getRecords, getRecordData, type GetRecordsParams, type GetRecordDataParams } from "../api";
import { GetRecordsSchema, GetRecordDataSchema } from "../schemas";

export const recordsQueryOptions = (params: Partial<GetRecordsParams>) => {
  const result = GetRecordsSchema.safeParse(params);
  return queryOptions({
    queryKey: ["records", result.data?.realm, result.data?.faction, result.data?.page],
    queryFn: () => getRecords(result.data!),
    enabled: result.success,
  });
};

export const recordDataQueryOptions = (params: Partial<GetRecordDataParams>) => {
  const result = GetRecordDataSchema.safeParse(params);
  return queryOptions({
    queryKey: ["recordData", result.data?.realm, result.data?.faction, result.data?.selected_record],
    queryFn: () => getRecordData(result.data!),
    enabled: result.success,
  });
};