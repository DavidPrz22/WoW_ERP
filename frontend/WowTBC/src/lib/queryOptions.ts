import { queryOptions } from "@tanstack/react-query";
import {
    fetchClassSubclass,
    fetchQuality,
    fetchFaction,
    fetchRealm,
} from "../api/api";

export const classSubclassQueryOptions = () => queryOptions({
    queryKey: ['class-subclass'],
    queryFn: fetchClassSubclass,
    staleTime: Infinity
});

export const qualityQueryOptions = () => queryOptions({
    queryKey: ['quality'],
    queryFn: fetchQuality,
    staleTime: Infinity
});

export const factionQueryOptions = () => queryOptions({
    queryKey: ['faction'],
    queryFn: fetchFaction,
    staleTime: Infinity
});

export const realmQueryOptions = () => queryOptions({
    queryKey: ['realm'],
    queryFn: fetchRealm,
    staleTime: Infinity
});
