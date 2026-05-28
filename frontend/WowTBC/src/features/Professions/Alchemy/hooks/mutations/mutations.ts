import { useMutation } from '@tanstack/react-query';
import { registerGroupAlchemyItem } from '../../api';
import type { TCreateAlchemyItemPayload } from '../../types/index';
import { useQueryClient } from '@tanstack/react-query';
import { ALCHEMY_GROUP_DATA } from '../../hooks/queries/queryOptions';

export const useCreateAlchemyItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreateAlchemyItemPayload) => registerGroupAlchemyItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALCHEMY_GROUP_DATA] });
    },
  });
};
