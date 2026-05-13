import apiClient from '@/api';
import type { PaginatedResponse, SystemRecord } from '../types';

export interface GetRecordsParams {
  realm?: string;
  faction?: string;
  page?: number;
  page_size?: number;
}

export const getRecords = async (params: GetRecordsParams): Promise<PaginatedResponse<SystemRecord>> => {
  const { data } = await apiClient.get<PaginatedResponse<SystemRecord>>('registros/records/', {
    params,
  });
  return data;
};
