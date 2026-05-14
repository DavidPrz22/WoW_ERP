import apiClient from '@/api';
import type { PaginatedResponse, SystemRecord } from '../types';

export interface GetRecordsParams {
  realm?: string;
  faction?: string;
  page?: number;
  page_size?: number;
}

export const getRecords = async (params: GetRecordsParams): Promise<PaginatedResponse<SystemRecord>> => {
  try {
    const { data } = await apiClient.get<PaginatedResponse<SystemRecord>>('registros/records/', {
      params,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};  

export const generateRecord = async (): Promise<{ message: string }> => {
  const response = await apiClient.post('registros/records/generate/');
  return response.data;
};
