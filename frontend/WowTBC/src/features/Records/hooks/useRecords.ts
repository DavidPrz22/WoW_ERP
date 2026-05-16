import { useQuery } from "@tanstack/react-query";
import { recordsQueryOptions, recordDataQueryOptions } from "./queryOptions";
import type { GetRecordsParams, GetRecordDataParams } from "../api";

export const useRecords = (params: Partial<GetRecordsParams>) => {
  return useQuery(recordsQueryOptions(params));
};

export const useRecordData = (params: Partial<GetRecordDataParams>) => {
  return useQuery(recordDataQueryOptions(params));
};
