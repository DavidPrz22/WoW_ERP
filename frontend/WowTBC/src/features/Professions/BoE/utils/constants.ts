export const AH_CUT = 0.05;

export const PROFESSION_COLORS: Record<string, string> = {
  Tailoring: "bg-[hsl(280_55%_45%)]",
  Blacksmithing: "bg-[hsl(0_72%_45%)]",
  Leatherworking: "bg-[hsl(24_60%_40%)]",
  Engineering: "bg-[hsl(48_70%_45%)]",
};

export const CATEGORY_DOT: Record<string, string> = {
  Gear: "bg-[hsl(214_80%_55%)]",
  Enhancement: "bg-[hsl(280_55%_60%)]",
  Consumable: "bg-[hsl(142_55%_50%)]",
  Misc: "bg-muted-foreground",
};

export const CATEGORY_BADGE: Record<string, string> = {
  Gear: "bg-[hsl(214_80%_55%)]/10 text-[hsl(214_80%_80%)] border-[hsl(214_80%_55%)]/30",
  Enhancement: "bg-[hsl(280_55%_60%)]/10 text-[hsl(280_55%_85%)] border-[hsl(280_55%_60%)]/30",
  Consumable: "bg-[hsl(142_55%_50%)]/10 text-[hsl(142_55%_80%)] border-[hsl(142_55%_50%)]/30",
  Misc: "bg-muted/30 text-muted-foreground border-border/50",
};
