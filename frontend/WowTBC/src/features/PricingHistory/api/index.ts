import apiClient from '../../../api';
import type { TPricingSearchValues, TPricingHistoryValues } from '../schemas';

export const fetchClassSubclass = async () => {
    const res = await apiClient.get('registros/filters/class-subclass/');
    return res.data;
};

export const fetchQuality = async () => {
    const res = await apiClient.get('registros/filters/quality/');
    return res.data;
};

export const fetchFaction = async () => {
    const res = await apiClient.get('registros/filters/faction/');
    return res.data;
};

export const fetchRealm = async () => {
    const res = await apiClient.get('registros/filters/realm/');
    return res.data;
};

export const searchItems = async (params: TPricingSearchValues) => {
    const res = await apiClient.get('registros/items/search/', { params });
    console.log(res.data);
    return res.data;
};

export const fetchPricingHistory = async (params: TPricingHistoryValues) => {
    const res = await apiClient.get('registros/pricing-history/', { params });
    console.log(res.data);
    return res.data;
};
