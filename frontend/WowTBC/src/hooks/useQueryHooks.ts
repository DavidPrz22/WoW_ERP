import { useQuery } from "@tanstack/react-query";
import {
    classSubclassQueryOptions,
    qualityQueryOptions,
    factionQueryOptions,
    realmQueryOptions,
    userDataQueryOptions,
    recordsSelectQueryOptions,
} from "../lib/queryOptions";
import type { TGetRecordsSelectParams } from "@/schemas/schemas";

export const useClassSubclass = () => useQuery(classSubclassQueryOptions());

export const useQualityOptions = () => useQuery(qualityQueryOptions());

export const useFactionOptions = () => useQuery(factionQueryOptions());

export const useRealmOptions = () => useQuery(realmQueryOptions());

export const useUserDataRecordDetails = () => useQuery(userDataQueryOptions());

export const useRecordsSelect = (params: TGetRecordsSelectParams) => useQuery(recordsSelectQueryOptions(params));