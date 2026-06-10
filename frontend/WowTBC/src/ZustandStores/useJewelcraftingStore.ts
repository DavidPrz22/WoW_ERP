import { create } from 'zustand';
import type { JewelcraftingRawGem, JewelcraftingCutGem } from '@/features/Professions/Jewelcrafting/types/types';

type PriceRecord = Record<string, number>;
type PriceUpdater = PriceRecord | ((prev: PriceRecord) => PriceRecord);

interface JewelcraftingStore {
  dataFaction: string;
  dataRealm: string;
  dataRecordId: string;
  rawGems: JewelcraftingRawGem[] | null;
  cutGems: JewelcraftingCutGem[] | null;
  prospectAhPrices: PriceRecord;
  prospectPrices: PriceRecord;
  quantities: Record<string, number>;
  setDataFaction: (faction: string) => void;
  setDataRealm: (realm: string) => void;
  setDataRecordId: (recordId: string) => void;
  setRawGems: (gems: JewelcraftingRawGem[] | null) => void;
  setCutGems: (cuts: JewelcraftingCutGem[] | null) => void;
  setProspectAhPrices: (updater: PriceUpdater) => void;
  setProspectPrices: (updater: PriceUpdater) => void;
  setQty: (name: string, val: number) => void;
  obtenidoOverrides: PriceRecord;
  setObtenidoOverrides: (updater: PriceUpdater) => void;
}

export const useJewelcraftingStore = create<JewelcraftingStore>((set) => ({
  dataFaction: '',
  dataRealm: '',
  dataRecordId: '',
  rawGems: null,
  cutGems: null,
  prospectAhPrices: {},
  prospectPrices: {},
  quantities: {},
  obtenidoOverrides: {},
  setDataFaction: (dataFaction) => set({ dataFaction, dataRealm: '', dataRecordId: '' }),
  setDataRealm: (dataRealm) => set({ dataRealm, dataRecordId: '' }),
  setDataRecordId: (dataRecordId) => set({ dataRecordId }),
  setRawGems: (rawGems) => set({ rawGems }),
  setCutGems: (cutGems) => set({ cutGems }),
  setProspectAhPrices: (updater) => set((state) => ({
    prospectAhPrices: typeof updater === 'function' ? (updater as (p: PriceRecord) => PriceRecord)(state.prospectAhPrices) : updater,
  })),
  setProspectPrices: (updater) => set((state) => ({
    prospectPrices: typeof updater === 'function' ? (updater as (p: PriceRecord) => PriceRecord)(state.prospectPrices) : updater,
  })),
  setQty: (name, val) => set((state) => ({
    quantities: { ...state.quantities, [name]: val },
  })),
  setObtenidoOverrides: (updater) => set((state) => ({
    obtenidoOverrides: typeof updater === 'function' ? (updater as (p: PriceRecord) => PriceRecord)(state.obtenidoOverrides) : updater,
  })),
}));