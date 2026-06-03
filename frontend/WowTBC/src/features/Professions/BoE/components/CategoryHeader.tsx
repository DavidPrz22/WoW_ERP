import { cn } from "@/lib/utils";
import type { Category } from "../types/types";
import { CATEGORY_BADGE, CATEGORY_DOT } from "../utils/constants";

export interface CategoryHeaderProps {
  category: Category;
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className={cn("flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border rounded-sm", CATEGORY_BADGE[category])}>
        <span className={cn("w-1.5 h-1.5 rounded-full", CATEGORY_DOT[category])} />
        {category}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
    </div>
  );
}
