import { cn } from "@/lib/utils";
import type { Profession } from "../types/types";
import { PROFESSION_COLORS } from "../utils/constants";

export interface ProfessionHeaderProps {
  profession: Profession;
  itemCount: number;
}

export function ProfessionHeader({ profession, itemCount }: ProfessionHeaderProps) {
  return (
    <div className="flex items-stretch border border-border/70 bg-card/40 shadow-panel overflow-hidden">
      <div className={cn("w-2", PROFESSION_COLORS[profession])} />
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="font-display text-base text-gold uppercase tracking-[0.2em]">
          {profession}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-secondary/60 border border-border/40 rounded-sm px-2 py-0.5">
          {itemCount} items
        </span>
      </div>
    </div>
  );
}
