export type BuffType = "AGI" | "SP" | "STA" | "STR" | "HEAL" | "HIT" | "PET";

export type Recipe = {
  name: string;
  buff: BuffType;
  craftingCost: number;
  ahPrice: number;
};
