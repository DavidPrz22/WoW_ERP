import { useQuery } from "@tanstack/react-query";
import {
    classSubclassQueryOptions,
    qualityQueryOptions,
    factionQueryOptions,
    realmQueryOptions,
    userDataQueryOptions,
} from "../lib/queryOptions";

export const useClassSubclass = () => useQuery(classSubclassQueryOptions());

export const useQualityOptions = () => useQuery(qualityQueryOptions());

export const useFactionOptions = () => useQuery(factionQueryOptions());

export const useRealmOptions = () => useQuery(realmQueryOptions());

export const useUserDataRecordDetails = () => useQuery(userDataQueryOptions());