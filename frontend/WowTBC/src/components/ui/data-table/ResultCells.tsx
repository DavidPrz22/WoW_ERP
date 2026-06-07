import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { RowData } from "./types";
import { calcRowMetrics, formatCurrency } from "./utils";

export function ResultCells({ row }: { row: RowData }) {
  const { breakeven, profit, roi } = calcRowMetrics(row);
  const noAh = row.ah <= 0;
  const positive = profit >= 0;
  return (
    <>
      <TableCell className="py-2 text-right tabular-nums font-mono">{formatCurrency(row.cost)}</TableCell>
      <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
        {formatCurrency(breakeven)}
      </TableCell>
      <TableCell className="py-2 text-center tabular-nums font-mono text-gold">
        {noAh ? <span className="text-muted-foreground/60">—</span> : formatCurrency(row.ah, 4)}
      </TableCell>
      <TableCell
        className={cn(
          "py-2 text-right tabular-nums font-mono font-medium",
          noAh ? "text-muted-foreground/60" : positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
        )}
      >
        {noAh ? "—" : `${positive ? "+" : ""}${formatCurrency(profit, 4)}`}
      </TableCell>
      <TableCell
        className={cn(
          "py-2 text-right tabular-nums font-mono",
          noAh ? "text-muted-foreground/60" : roi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
        )}
      >
        {noAh ? "—" : `${formatCurrency(roi, 4)}%`}
      </TableCell>
    </>
  );
}
