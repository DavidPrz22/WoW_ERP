export type ProspectResult = {
  name: string;
  chance: number;
  expected: number;
  vendor?: number;
};

export type Cut = {
  name: string;
  ahPrice: number;
};

export type JewelcraftingItemResponse = {
  name: string;
  procChance: number;
  vendorPrice: number;
  ahPrice: number | null;
};

export type CutSection = {
  key: string;
  color: string; // tailwind/custom class for header bar background
  label: string;
  gem: string; // raw gem the cut uses
  cuts: Cut[];
};
