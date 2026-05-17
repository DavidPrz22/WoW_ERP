import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { generateRecord, overridePrice } from '../../api';
import { toast } from 'sonner';

export const useGenerateRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Snapshot generated successfully');
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error('Failed to generate snapshot', {
        description: error.response?.data?.error || error.message || 'An unknown error occurred',
      });
    },
  });
};

export const useOverridePriceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: overridePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordData'] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error('Failed to override price', {
        description: error.response?.data?.error || error.message || 'An unknown error occurred',
      });
    },
  });
};
