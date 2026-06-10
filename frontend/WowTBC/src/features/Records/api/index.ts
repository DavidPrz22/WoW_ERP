import apiClient from '@/api';
import type { PaginatedResponse, RecordDataApi, SystemRecord, OverRidePriceParams } from '../types';
import { type TGetRecordsParams } from '../schemas';
import { type TGetRecordDataParams } from '@/schemas/schemas';

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
  try {
    const response = await apiClient.post('registros/records/generate/');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getRecordData = async (params: TGetRecordDataParams): Promise<RecordDataApi> => {
  try {
    const response = await apiClient.get('registros/records/data/', { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const overridePrice = async (params: OverRidePriceParams): Promise<{ message: string }> => {
  try {
  const response = await apiClient.post('registros/records/override_price/', {
    record_id: params.recordId,
    item_id: params.itemId,
    new_price: params.newPrice,
  });
  return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteRecord = async (recordId: number): Promise<{ message: string }> => {
  try {
    const response = await apiClient.delete(`registros/records/${recordId}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};