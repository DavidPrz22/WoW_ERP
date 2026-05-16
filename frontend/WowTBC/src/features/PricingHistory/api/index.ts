import apiClient from '../../../api';
import type { TPricingSearchValues, TPricingHistoryValues } from '../schemas';

import type { CompareItem, ItemSearchResult } from '../types';

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
