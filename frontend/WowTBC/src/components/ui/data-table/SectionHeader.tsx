import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  icon: Icon,
  accent,
  count,
}: {
  title: string;
  icon?: LucideIcon;
  accent: string;
  count: number;
}) {
  return (
    <div className="flex items-stretch border border-border/70 bg-card/40 shadow-panel overflow-hidden">
      <div className={cn("w-2", accent)} />
      <div className="px-4 py-3 flex items-center gap-3 flex-1">
        {Icon && <Icon className="h-4 w-4 text-gold" />}
        <div className="font-display text-base text-gold uppercase tracking-[0.2em]">{title}</div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-secondary/60 border border-border/40 rounded-sm px-2 py-0.5">
          {count} items
        </span>
      </div>
    </div>
  );
}
