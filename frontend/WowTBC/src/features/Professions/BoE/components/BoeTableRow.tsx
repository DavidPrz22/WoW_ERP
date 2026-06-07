import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { BoeApiItem, NetherPrices } from "../types/types";
import { useBoeItemMetrics } from "../hooks/useBoeItemMetrics";
import { WowCurrency } from "./WowCurrency";

export interface BoeTableRowProps {
  item: BoeApiItem;
  netherPrices: NetherPrices;
}

export function BoeTableRow({ item, netherPrices }: BoeTableRowProps) {
  const { cost, breakeven, profit, roi, hasAhPrice, ahPrice } = useBoeItemMetrics(item, netherPrices);

  const positive = profit >= 0;
  const usesNether = item.reagents.some((r) => r.is_nether_input);

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
      <TableCell className="py-2 text-right"><WowCurrency value={cost} /></TableCell>
      <TableCell className="py-2 text-right text-muted-foreground"><WowCurrency value={breakeven} /></TableCell>
      <TableCell className="py-2 text-center text-gold">
        {!hasAhPrice ? <span className="text-muted-foreground/60">—</span> : <WowCurrency value={ahPrice} />}
      </TableCell>
      <TableCell
        className={cn(
          "py-2 text-right font-medium",
          !hasAhPrice ? "text-muted-foreground/60" : positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
        )}
      >
        {!hasAhPrice ? "—" : <WowCurrency value={profit} isProfit />}
      </TableCell>
      <TableCell
        className={cn(
          "py-2 text-right",
          !hasAhPrice ? "text-muted-foreground/60" : roi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
        )}
      >
        {!hasAhPrice ? "—" : `${fmt(roi, 2)}%`}
      </TableCell>
    </TableRow>
  );
}

function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}
