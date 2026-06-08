import apiClient from '@/api/index';
import type { TEngineeringDataQueryParams, TEngineeringApiResponse } from '../schemas/schemas';

export const getEngineeringData = async (params: TEngineeringDataQueryParams): Promise<TEngineeringApiResponse> => {
  try {
    const res = await apiClient.post<TEngineeringApiResponse>('engineering/data/', params);
    return res.data;
  } catch (error) {
    console.error('Error fetching engineering data:', error);
    throw error;
  }
};
