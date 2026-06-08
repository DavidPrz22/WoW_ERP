export interface EngReagent {
  id: number;
  name: string;
  quantity: number;
  min_buyout: number | null;
  overriden_min_buyout: number | null;
}

export interface EngShoppingReagent {
  name: string;
  id: number;
  qty: number;
}

export interface EngItem {
  name: string;
  id_ingame: number;
  type: string;
  yield_quantity: number;
  reagents: EngReagent[];
  min_buyout: number | null;
  overriden_min_buyout: number | null;
}

export interface EngineeringApiResponse {
  parts: EngItem[];
  explosives: EngItem[];
  total_reagents_used: {
    Parts: Record<string, EngShoppingReagent[]>;
    Explosives: Record<string, EngShoppingReagent[]>;
  };
}

export type EngineeringQuantities = Record<string, number>;

export interface EngineeringStore {
  dataFaction: string;
  dataRealm: string;
  dataRecordId: string;
  partsData: EngItem[] | null;
  explosivesData: EngItem[] | null;
  buyReagentsToggles: Record<string, boolean>;
  quantities: EngineeringQuantities;
  reagentList: {
    Parts: Record<string, EngShoppingReagent[]>;
    Explosives: Record<string, EngShoppingReagent[]>;
  } | null;

  setDataFaction: (faction: string) => void;
  setDataRealm: (realm: string) => void;
  setDataRecordId: (recordId: string) => void;
  setPartsData: (parts: EngItem[] | null) => void;
  setExplosivesData: (explosives: EngItem[] | null) => void;
  setBuyReagentToggle: (itemName: string, value: boolean) => void;
  setQuantities: (qtys: EngineeringQuantities) => void;
  setQty: (itemName: string, qty: number) => void;
  setReagentList: (reagentList: EngineeringApiResponse['total_reagents_used'] | null) => void;
}
