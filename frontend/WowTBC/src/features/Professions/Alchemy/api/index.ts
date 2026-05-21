import apiClient from '@/api/index';
import type { TItemSearchParams, TItemSearchResponse, TCreateAlchemyItemPayload } from '../types/index';
import { type TGetRecordDataParams } from '@/schemas/schemas';

export const fetchItemSearch = async (params: TItemSearchParams): Promise<TItemSearchResponse[]> => {
    try {
        const res = await apiClient.get<TItemSearchResponse[]>('registros/items/search/', { params });
        console.log('Item search:', res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching item search:', error);
        throw error;
    }
};

export const registerGroupAlchemyItem = async (payload: TCreateAlchemyItemPayload) => {
    try {
        const res = await apiClient.post('alchemy/items/create/', payload);
        return res.data;
    } catch (error) {
        console.error('Error creating alchemy item:', error);
        throw error;
    }
};

export const getAlchemyGroupsData = async (params: TGetRecordDataParams) => {
    try {
        const res = await apiClient.get('alchemy/groups/data/', { params });
        return res.data;
    } catch (error) {
        console.error('Error fetching alchemy groups data:', error);
        throw error;
    }
}