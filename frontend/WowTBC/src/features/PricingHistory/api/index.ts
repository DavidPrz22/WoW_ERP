import apiClient from '../../../api';
import type { TPricingSearchValues, TPricingHistoryValues } from '../schemas';
import type { CompareItem, TItemClass, TRealm, ItemSearchResult } from '../types';

export const fetchClassSubclass = async (): Promise<TItemClass[]> => {
    const res = await apiClient.get<TItemClass[]>('registros/filters/class-subclass/');
    return res.data;
};

export const fetchQuality = async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>('registros/filters/quality/');
    return res.data;
};

export const fetchFaction = async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>('registros/filters/faction/');
    return res.data;
};

export const fetchRealm = async (): Promise<TRealm[]> => {
    const res = await apiClient.get<TRealm[]>('registros/filters/realm/');
    return res.data;
};

export const searchItems = async (params: TPricingSearchValues) : Promise<ItemSearchResult[]>=> {
    const res = await apiClient.get('registros/items/search/', { params });
    console.log(res.data);
    return res.data;
};

export const fetchPricingHistory = async (params: TPricingHistoryValues): Promise<CompareItem> => {
    const res = await apiClient.get('registros/pricing-history/', { params });
    console.log(
        'real rhiasdfasfd', res.data);
    return res.data;
};
