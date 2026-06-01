import { useQuery } from '@tanstack/react-query';
import type { TGetJewelcraftingItemsParams } from '@/schemas/schemas';
import { jewelcraftingItemsQueryOptions } from './queryOptions';

export const useJewelcraftingItems = (params: TGetJewelcraftingItemsParams) =>
  useQuery(jewelcraftingItemsQueryOptions(params));