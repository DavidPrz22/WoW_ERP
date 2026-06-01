import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AH_CUT } from "../utils/constants";
import { fmt, fmtCopper } from "../utils/helpers";
import type { JewelcraftingCutGem } from "../types/types";

interface GemcuttingSectionTableProps {
  color: string;
  colorClass: string;
  gem: string;
  items: JewelcraftingCutGem[];
  cost: number;
  breakeven: number;
  cutPrices: Record<string, number>;
  setCutPrices: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
}

export function GemcuttingSectionTable({
  colorClass,
  color,
  gem,
  items,
  cost,
  breakeven: sectionBreakeven,
  cutPrices,
  setCutPrices,
}: GemcuttingSectionTableProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-stretch border border-border/70 bg-card/40 shadow-panel overflow-hidden">
        <div className={cn("w-2", colorClass)} />
        <div className="px-4 py-2 font-display text-sm text-gold uppercase tracking-[0.2em]">
          {color}
          <span className="ml-3 text-xs normal-case tracking-normal text-muted-foreground">
            {gem} · {fmt(cost, 4)}g
          </span>
        </div>
      </div>
      <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="bg-secondary/40 border-b border-border/70 hover:bg-secondary/40">
              <TableHead className="h-10 uppercase tracking-wider text-xs">Cut</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven Price</TableHead>
              <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">AH Price</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit/Item</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const ahCopperVal = item.ahPrice;
              const craftingCostCopperVal = cost * 10000;
              const rowCost = craftingCostCopperVal / 10000;
              const rowBreakeven = rowCost / (1 - AH_CUT);

              const ahCopperInput = cutPrices[item.name] ?? ahCopperVal ?? 0;
              const ah = ahCopperInput / 10000;
              const profit = ah * (1 - AH_CUT) - rowCost;
              const roi = rowCost > 0 ? (profit / rowCost) * 100 : 0;
              const positive = profit >= 0;
              return (
                <TableRow key={item.name} className="border-b border-border/40 hover:bg-secondary/30">
                  <TableCell className="py-2 font-medium text-gold">{item.name}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono">{fmtCopper(rowCost)}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
                    {fmtCopper(rowBreakeven)}
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={ahCopperInput === 0 && ahCopperVal === null ? "" : ah}
                      placeholder={ahCopperVal === null ? "—" : undefined}
                      onChange={(e) =>
                        setCutPrices((p) => ({ ...p, [item.name]: (parseFloat(e.target.value) || 0) * 10000 }))
                      }
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono font-medium", positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {positive ? "+" : ""}{fmtCopper(profit)}
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono", roi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {fmt(roi, 2)}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}