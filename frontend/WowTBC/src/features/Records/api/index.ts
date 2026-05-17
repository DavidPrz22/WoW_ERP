import apiClient from '@/api';
import type { PaginatedResponse, SystemRecord } from '../types';
import { type TGetRecordDataParams, type TGetRecordsParams } from '../schemas';


export const getRecords = async (params: TGetRecordsParams): Promise<PaginatedResponse<SystemRecord>> => {
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


export const getRecordData = async (params: TGetRecordDataParams): Promise<any> => {
  const response = await apiClient.get('registros/records/data/', { params });
  return response.data;
};
