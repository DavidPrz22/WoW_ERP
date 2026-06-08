import apiClient from '@/api/index';
import type { CookingCalculationsResponse, TGetCookingGroupsDataParams } from "../types";

export const getCookingGroupsData = async (
  params: TGetCookingGroupsDataParams
): Promise<CookingCalculationsResponse> => {
  const res = await apiClient.post<CookingCalculationsResponse>(
    "cooking/groups/data/",
    params
  );
  return res.data;
};
