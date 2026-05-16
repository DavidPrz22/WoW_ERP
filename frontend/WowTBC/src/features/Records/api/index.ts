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

export const getRealms = async (): Promise<{ realm_name: string }[]> => {
  const response = await apiClient.get<{ realm_name: string }[]>('registros/filters/realm/');
  return response.data;
};

export interface GetRecordDataParams {
  realm: string;
  faction: string;
  selected_record: string;
}

export const getRecordData = async (params: GetRecordDataParams): Promise<any> => {
  const response = await apiClient.get('registros/records/data/', { params });
  return response.data;
};
