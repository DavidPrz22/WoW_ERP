import apiClient from './index';
import type { TItemClass, TRealm } from '../types/types';

export const fetchClassSubclass = async (): Promise<TItemClass[]> => {
    const res = await apiClient.get<TItemClass[]>('registros/filters/class-subclass/');
    return res.data;
};

export const fetchQuality = async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>('registros/filters/quality/');
    return res.data;
};

export const fetchFaction = async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>('registros/filters/faction/');
    return res.data;
};

export const fetchRealm = async (): Promise<TRealm[]> => {
    const res = await apiClient.get<TRealm[]>('registros/filters/realm/');
    return res.data;
};
