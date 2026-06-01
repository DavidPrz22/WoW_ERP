import { queryOptions, keepPreviousData } from '@tanstack/react-query';
import { getJewelcraftingItems } from '../../api/api';
import { GetJewelcraftingItemsSchema } from '@/schemas/schemas';
import type { TGetJewelcraftingItemsParams } from '@/schemas/schemas';

export const JEWELCRAFTING_ITEMS_KEY = 'jewelcrafting-items';

export const jewelcraftingItemsQueryOptions = (params: TGetJewelcraftingItemsParams) => {
  const parsed = GetJewelcraftingItemsSchema.safeParse(params);
  return queryOptions({
    queryKey: [JEWELCRAFTING_ITEMS_KEY, params],
    queryFn: () => getJewelcraftingItems(params),
    enabled: parsed.success,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });
};