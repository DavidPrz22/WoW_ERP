import { useRecords } from '@/features/Records/hooks/queries/useRecords';
import { useRecordData } from '@/features/Records/hooks/queries/useRecords';
import { useAlchemyGroupData } from '@/features/Professions/Alchemy/hooks/queries/queries';
import { useCookingGroupData } from '@/features/Professions/Cooking/hooks/queries/queries';
import { useEngineeringData } from '@/features/Professions/Engineering/hooks/queries/queries';
import { useJewelcraftingItems } from '@/features/Professions/Jewelcrafting/hooks/queries/queries';
import { useBoeData } from '@/features/Professions/BoE/hooks/queries/queries';

export const useHomeRecords = () => {
  return useRecords({ page_size: 10 });
};

export const useHomeRecordData = (realm: string, faction: string, recordId: string) => {
  return useRecordData({ realm, faction, selected_record: recordId });
};

export const useHomeAlchemyData = (realm: string, faction: string, recordId: string) => {
  return useAlchemyGroupData({ realm, faction, selected_record: recordId });
};

export const useHomeCookingData = (realm: string, faction: string, recordId: string) => {
  return useCookingGroupData({ realm, faction, selected_record: recordId });
};

export const useHomeEngineeringData = (realm: string, faction: string, recordId: string) => {
  return useEngineeringData({ realm, faction, record_id: parseInt(recordId) });
};

export const useHomeJewelcraftingData = (realm: string, faction: string, recordId: string) => {
  return useJewelcraftingItems({ realm, faction, record_id: parseInt(recordId) });
};

export const useHomeBoeData = (realm: string, faction: string, recordId: string) => {
  return useBoeData({ realm, faction, record_id: parseInt(recordId) });
};

export const getLatestRecord = (data?: { results?: Array<{ id: number; realm_name: string; faction: string }> }) => {
  if (!data?.results || data.results.length === 0) return null;
  const latest = data.results[0];
  return {
    realm: latest.realm_name,
    faction: latest.faction,
    recordId: String(latest.id),
  };
};
