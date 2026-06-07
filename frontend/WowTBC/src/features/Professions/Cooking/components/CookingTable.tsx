import { Fragment, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BUFF_META, ORDER, RECIPES, AH_CUT } from "../data";

import { formatCurrency, calcRowMetrics } from "@/components/ui/data-table/utils";
import { ResultCells } from "@/components/ui/data-table/ResultCells";
import { ResultHeaderCells } from "@/components/ui/data-table/ResultHeaderCells";

export function CookingTable() {
  const [qty, setQty] = useState<Record<string, number>>({});

  const grouped = ORDER.map((buff) => ({
    buff,
    items: RECIPES.filter((r) => r.buff === buff),
  })).filter((g) => g.items.length > 0);

  let totalProfit = 0;
  for (const r of RECIPES) {
    const noAh = r.ahPrice <= 0;
    const { profit } = calcRowMetrics({ name: r.name, cost: r.craftingCost, ah: r.ahPrice });
    totalProfit += (noAh ? 0 : profit) * (qty[r.name] ?? 0);
  }

  return (
    <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="bg-secondary/50 border-b border-primary/20 hover:bg-secondary/50">
            <TableHead className="h-10 uppercase tracking-wider text-xs">Item</TableHead>
            <ResultHeaderCells />
            <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">Qty to Make</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Expected Profit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grouped.map((group) => {
            const meta = BUFF_META[group.buff];
            return (
              <Fragment key={group.buff}>
                <TableRow className="bg-secondary/30 hover:bg-secondary/30 border-b border-border/40">
                  <TableCell colSpan={8} className="py-2">
                    <div className="flex items-center gap-3">
                      <span className={cn("w-2 h-2 rounded-full", meta.dot)} />
                      <span className="font-display text-xs text-gold uppercase tracking-[0.25em]">
                        {meta.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-secondary/60 border border-border/40 rounded-sm px-2 py-0.5">
                        {group.items.length}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                    </div>
                  </TableCell>
                </TableRow>
                {group.items.map((r) => {
                  const noAh = r.ahPrice <= 0;
                  const { profit } = calcRowMetrics({ name: r.name, cost: r.craftingCost, ah: r.ahPrice });
                  const q = qty[r.name] ?? 0;
                  const expected = (noAh ? 0 : profit) * q;
                  return (
                    <TableRow key={r.name} className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
                      <TableCell className="py-2 font-medium text-gold">{r.name}</TableCell>
                      <ResultCells row={{ name: r.name, cost: r.craftingCost, ah: r.ahPrice }} />
                      <TableCell className="py-2 text-center">
                        <Input
                          type="number"
                          min={0}
                          value={q || ""}
                          onChange={(e) =>
                            setQty((s) => ({ ...s, [r.name]: parseInt(e.target.value) || 0 }))
                          }
                          placeholder="0"
                          className="h-8 w-24 mx-auto text-right tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                        />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "py-2 text-right tabular-nums font-mono font-medium",
                          expected > 0 ? "text-[hsl(var(--quality-uncommon))]" : expected < 0 ? "text-destructive" : "text-muted-foreground/60",
                        )}
                      >
                        {q > 0 && !noAh ? `${expected > 0 ? "+" : ""}${formatCurrency(expected, 4)}` : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            );
          })}
        </TableBody>
        <TableFooter className="bg-secondary/60 border-t border-primary/20">
          <TableRow className="hover:bg-secondary/60">
            <TableCell colSpan={7} className="py-3 text-right uppercase tracking-wider text-xs text-gold font-display">
              Total Expected Profit
            </TableCell>
            <TableCell
              className={cn(
                "py-3 text-right tabular-nums font-mono font-bold",
                totalProfit > 0 ? "text-[hsl(var(--quality-uncommon))]" : totalProfit < 0 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {`${totalProfit > 0 ? "+" : ""}${formatCurrency(totalProfit, 4)}`}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
