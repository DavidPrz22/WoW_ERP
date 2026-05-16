import { useQuery } from "@tanstack/react-query";
import { recordsQueryOptions, recordDataQueryOptions } from "./queryOptions";
import { type TGetRecordDataParams, type TGetRecordsParams } from '../schemas';


export const useRecords = (params: Partial<TGetRecordsParams>) => {
  return useQuery(recordsQueryOptions(params));
};

export const useRecordData = (params: Partial<TGetRecordDataParams>) => {
  return useQuery(recordDataQueryOptions(params));
};
