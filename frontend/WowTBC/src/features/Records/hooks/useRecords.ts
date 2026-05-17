import { useQuery } from "@tanstack/react-query";
import { recordsQueryOptions, recordDataQueryOptions, recordsSelectQueryOptions } from "./queryOptions";
import { type TGetRecordDataParams, type TGetRecordsParams, type TGetRecordsSelectParams } from '../schemas';


export const useRecords = (params: Partial<TGetRecordsParams>) => {
  return useQuery(recordsQueryOptions(params));
};

export const useRecordData = (params: Partial<TGetRecordDataParams>) => {
  return useQuery(recordDataQueryOptions(params));
};

export const useRecordsSelect = (params: TGetRecordsSelectParams) => {
  return useQuery(recordsSelectQueryOptions(params));
};
