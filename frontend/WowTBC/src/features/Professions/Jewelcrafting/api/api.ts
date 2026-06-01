import apiClient from '@/api/index';
import type { JewelcraftingItemsResponse } from '../types/types';
import type { TGetJewelcraftingItemsParams } from '@/schemas/schemas';

export const getJewelcraftingItems = async (
  params: TGetJewelcraftingItemsParams
): Promise<JewelcraftingItemsResponse> => {
  try {
    const res = await apiClient.get('jewelcrafting/items/', { params });
    console.log('Fetched jewelcrafting items:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching jewelcrafting items:', error);
    throw error;
  }
};