import { cn } from "@/lib/utils";
import { WowCurrency } from "./WowCurrency";

interface AlchemySummaryCardsProps {
  grand: { cost: number; profit: number };
}

export function AlchemySummaryCards({ grand }: AlchemySummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="border border-border/70 bg-card/40 px-5 py-4 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Cost</span>
        <span className="font-display text-2xl text-gold"><WowCurrency value={grand.cost} /></span>
      </div>
      <div className="border border-border/70 bg-card/40 px-5 py-4 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Profit</span>
        <span
          className={cn(
            "font-display text-2xl",
            grand.profit >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
          )}
        >
          <WowCurrency value={grand.profit} />
        </span>
      </div>
    </div>
  );
}
