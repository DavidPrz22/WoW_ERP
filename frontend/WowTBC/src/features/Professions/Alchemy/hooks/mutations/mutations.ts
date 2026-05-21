import { useMutation } from '@tanstack/react-query';
import { registerGroupAlchemyItem } from '../../api';
import type { TCreateAlchemyItemPayload } from '../../types/index';

export const useCreateAlchemyItemMutation = () => {

  return useMutation({
    mutationFn: (payload: TCreateAlchemyItemPayload) => registerGroupAlchemyItem(payload),
    onSuccess: () => {
      // Invalidate relevant queries here if needed, for example:
      // queryClient.invalidateQueries({ queryKey: ['alchemyItems'] });
    },
  });
};
