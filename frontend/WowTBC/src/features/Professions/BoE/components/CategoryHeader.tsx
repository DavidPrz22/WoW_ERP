import { cn } from "@/lib/utils";
import type { Category } from "../types/types";
import { CATEGORY_BADGE, CATEGORY_DOT } from "../utils/constants";

export interface CategoryHeaderProps {
  category: string;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  const badgeClass = CATEGORY_BADGE[category as Category] || "bg-muted/30 text-muted-foreground border-border/50";
  const dotClass = CATEGORY_DOT[category as Category] || "bg-muted-foreground";

  return (
    <div className="flex items-center gap-3 px-1">
      <span className={cn("flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border rounded-sm", badgeClass)}>
        <span className={cn("w-1.5 h-1.5 rounded-full", dotClass)} />
        {category}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
    </div>
  );
}
