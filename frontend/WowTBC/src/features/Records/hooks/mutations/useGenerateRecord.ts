import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateRecord } from '../../api';
import { toast } from 'sonner';

export const useGenerateRecordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      toast.success('Snapshot generated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to generate snapshot', {
        description: error?.response?.data?.error || error.message || 'An unknown error occurred',
      });
    },
  });
};
