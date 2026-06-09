import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEngineeringStore } from "@/ZustandStores/useEngineeringStore";
import { calculateCraftingCost, calculateBreakeven, calculateProfitPerItem, calculateROI } from "../utils/helpers";
import { WowCurrency } from "./WowCurrency";
import { QtyInput } from "./QtyInput";

function getAhPrice(item: { min_buyout: number | null; overriden_min_buyout: number | null }): number {
  if (item.overriden_min_buyout !== null && item.overriden_min_buyout !== undefined) {
    return item.overriden_min_buyout;
  }
  return item.min_buyout ?? 0;
}

export function PartsTable() {
  const { partsData, quantities, setQty } = useEngineeringStore();

  const tableRows = useMemo(() => {
    if (!partsData) return { rows: [], totalProfit: 0 };

    let totalProfit = 0;
    const rows = partsData.map((part) => {
      const yieldQty = part.yield_quantity || 1;
      const craftingCost = calculateCraftingCost(part.reagents, yieldQty);
      const breakeven = calculateBreakeven(craftingCost);
      const ahPrice = getAhPrice(part);
      const profitPerItem = calculateProfitPerItem(ahPrice, craftingCost);
      const roi = calculateROI(profitPerItem, craftingCost);
      const noAh = ahPrice <= 0;
      const qty = quantities[part.name] ?? 0;
      const actualQty = qty * yieldQty;
      const expectedProfit = profitPerItem * actualQty;
      totalProfit += expectedProfit;

      return { part, yieldQty, craftingCost, breakeven, ahPrice, profitPerItem, roi, noAh, qty, actualQty, expectedProfit };
    });

    return { rows, totalProfit };
  }, [partsData, quantities]);

  if (!partsData || partsData.length === 0) {
    return (
      <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
        <div className="p-8 text-center text-muted-foreground">Select a record to view parts data</div>
      </div>
    );
  }

  return (
    <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="bg-secondary/50 border-b border-primary/20 hover:bg-secondary/50">
            <TableHead className="h-10 uppercase tracking-wider text-xs">Item</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs w-24">CRAFT AMT</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Yield</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs w-20">QTY</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven</TableHead>
            <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">AH Price</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit / Item</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Expected Profit</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows.rows.map(({ part, yieldQty, craftingCost, breakeven, ahPrice, profitPerItem, roi, noAh, qty, actualQty, expectedProfit }) => (
            <TableRow key={part.name} className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
              <TableCell className="py-2 font-medium text-gold">{part.name}</TableCell>
              <TableCell className="py-2 text-right">
                <QtyInput
                  value={qty}
                  onChange={(v) => setQty(part.name, v)}
                  className="h-7 w-16 ml-auto text-right tabular-nums"
                />
              </TableCell>
              <TableCell className="py-2 text-right tabular-nums font-mono">{yieldQty}</TableCell>
              <TableCell className="py-2 text-right tabular-nums font-mono">{actualQty}</TableCell>
              <TableCell className="py-2 text-right"><WowCurrency value={craftingCost} /></TableCell>
              <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
                <WowCurrency value={breakeven} />
              </TableCell>
              <TableCell className="py-2 text-center tabular-nums font-mono text-gold">
                {noAh ? <span className="text-muted-foreground/60">—</span> : <WowCurrency value={ahPrice} />}
              </TableCell>
              <TableCell className="py-2 text-right">
                {noAh ? <span className="text-muted-foreground/60">—</span> : <WowCurrency value={profitPerItem} isProfit={true} />}
              </TableCell>
              <TableCell className="py-2 text-right">
                {qty <= 0 || noAh ? (
                  <span className="text-muted-foreground/60">—</span>
                ) : (
                  <WowCurrency value={expectedProfit} isProfit={true} />
                )}
              </TableCell>
              <TableCell className="py-2 text-right tabular-nums font-mono">
                {noAh ? (
                  <span className="text-muted-foreground/60">—</span>
                ) : (
                  <span className={roi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive"}>
                    {roi.toFixed(2)}%
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-secondary/30 border-t-2 border-primary/30">
            <TableCell colSpan={8} className="py-3 font-semibold text-gold text-right">
              Total Expected Profit
            </TableCell>
            <TableCell className="py-3 text-right">
              <WowCurrency value={tableRows.totalProfit} isProfit={true} />
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
