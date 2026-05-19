import apiClient from './index';
import type { TItemClass, TRealm, RecordDetails } from '../types/types';

export const fetchClassSubclass = async (): Promise<TItemClass[]> => {
    try {
        const res = await apiClient.get<TItemClass[]>('registros/filters/class-subclass/');
        return res.data;
    } catch (error) {
        console.error('Error fetching class-subclass data:', error);
        throw error;
    }
};

export const fetchQuality = async (): Promise<string[]> => {
    try {
        const res = await apiClient.get<string[]>('registros/filters/quality/');
        return res.data;
    } catch (error) {
        console.error('Error fetching quality data:', error);
        throw error;
    }
};

export const fetchFaction = async (): Promise<string[]> => {
    try {
        const res = await apiClient.get<string[]>('registros/filters/faction/');
        return res.data;
    } catch (error) {
        console.error('Error fetching faction data:', error);
        throw error;
    }
};

export const fetchRealm = async (): Promise<TRealm[]> => {
    try {
        const res = await apiClient.get<TRealm[]>('registros/filters/realm/');
        return res.data;
    } catch (error) {
        console.error('Error fetching realm data:', error);
        throw error;
    }
};

export const fetchUserdataRecordDetails = async (): Promise<{ recordDetails: RecordDetails }> => {
    try {
        const res = await apiClient.get<{ recordDetails: RecordDetails }>('registros/user/data/');
        return res.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}