import { useQuery } from "@tanstack/react-query";
import {
    classSubclassQueryOptions,
    qualityQueryOptions,
    factionQueryOptions,
    realmQueryOptions,
} from "../lib/queryOptions";

export const useClassSubclass = () => useQuery(classSubclassQueryOptions());

export const useQualityOptions = () => useQuery(qualityQueryOptions());

export const useFactionOptions = () => useQuery(factionQueryOptions());

export const useRealmOptions = () => useQuery(realmQueryOptions());
