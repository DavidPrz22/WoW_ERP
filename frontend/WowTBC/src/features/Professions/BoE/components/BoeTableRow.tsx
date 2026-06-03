import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { BoeItem, NetherPrices } from "../types/types";
import { useBoeItemMetrics } from "../hooks/useBoeItemMetrics";
import { fmt } from "../utils/helpers";

export interface BoeTableRowProps {
  item: BoeItem;
  netherPrices: NetherPrices;
}

export function BoeTableRow({ item, netherPrices }: BoeTableRowProps) {
  const { cost, breakeven, profit, roi, hasAhPrice } = useBoeItemMetrics(item, netherPrices);

  const positive = profit >= 0;
  const usesNether = item.reagents.some((r) => r.isNether);

  return (
    <TableRow className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
      <TableCell className="py-2 font-medium text-gold">
        <div className="flex items-center gap-2">
          <span>{item.name}</span>
          {usesNether && (
            <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider px-2 py-0.5 border border-primary/30 text-primary/90 bg-primary/10 rounded-sm shadow-[0_0_8px_-2px_hsl(var(--primary)/0.25)]">
              <span className="w-1 h-1 rounded-full bg-primary/70" />
              Nether
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(cost, 4)}</TableCell>
      <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
        {fmt(breakeven, 4)}
      </TableCell>
      <TableCell className="py-2 text-center tabular-nums font-mono text-gold">
        {!hasAhPrice ? <span className="text-muted-foreground/60">—</span> : fmt(item.ahPrice, 2)}
      </TableCell>
      <TableCell
        className={cn(
          "py-2 text-right tabular-nums font-mono font-medium",
          !hasAhPrice ? "text-muted-foreground/60" : positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
        )}
      >
        {!hasAhPrice ? "—" : `${positive ? "+" : ""}${fmt(profit, 2)}`}
      </TableCell>
      <TableCell
        className={cn(
          "py-2 text-right tabular-nums font-mono",
          !hasAhPrice ? "text-muted-foreground/60" : roi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
        )}
      >
        {!hasAhPrice ? "—" : `${fmt(roi, 2)}%`}
      </TableCell>
    </TableRow>
  );
}
