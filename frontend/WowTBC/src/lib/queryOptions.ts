import { queryOptions } from "@tanstack/react-query";
import {
    fetchClassSubclass,
    fetchQuality,
    fetchFaction,
    fetchRealm,
    fetchUserdataRecordDetails,
} from "../api/api";

import { GetRecordsSelectSchema, type TGetRecordsSelectParams} from '@/schemas/schemas';
import { getRecords } from "@/features/Records/api";

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


export const userDataQueryOptions = () => queryOptions({
    queryKey: ['userdatarecorddetails'],
    queryFn: fetchUserdataRecordDetails,
    staleTime: Infinity
});

export const recordsSelectQueryOptions = (params: TGetRecordsSelectParams) => {
  const result = GetRecordsSelectSchema.safeParse(params);
  return queryOptions({
    queryKey: ["records_select", result.data?.realm, result.data?.faction],
    queryFn: () => getRecords(result.data!),
    enabled: result.success,
    staleTime: Infinity
  });
};

