import apiClient from '@/api';
import type { BoeApiDataResponse } from '../types/types';

export const getBoeData = async (params: { realm: string; faction: string; record_id: number }): Promise<BoeApiDataResponse> => {
  const { data } = await apiClient.post<BoeApiDataResponse>('boe/data/', params);
  return data;
};
