import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AlchemyGroup } from "../types";
import { fmt } from "../utils/helpers";
import { QtyInput } from "./QtyInput";

export function GroupTable({
  group,
  qtys,
  setQty,
}: {
  group: AlchemyGroup;
  qtys: Record<string, number>;
  setQty: (name: string, q: number) => void;
}) {
  const rows = group.items.map((item) => {
    const qty = qtys[item.name] || 0;
    const totalCost = item.craftingCost * qty;
    const expected = item.profitPerItem * qty;
    return { item, qty, totalCost, expected };
  });

  const totals = rows.reduce(
    (a, b) => ({ cost: a.cost + b.totalCost, expected: a.expected + b.expected }),
    { cost: 0, expected: 0 },
  );
  const qtySum = rows.reduce((a, b) => a + b.qty, 0);

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl text-gold uppercase tracking-[0.2em] border-l-4 border-primary pl-4">
        {group.group}
      </h2>
      <div className="group/table border border-border/70 bg-card/40 shadow-panel overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="bg-secondary/40 border-b border-border/70 hover:bg-secondary/40">
              <TableHead className="h-10 text-muted-foreground uppercase tracking-wider text-xs">Name</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Crafting Cost</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Breakeven</TableHead>
              <TableHead className="h-10 text-center w-28 text-muted-foreground uppercase tracking-wider text-xs">AH Price</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Profit/Item</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">ROI%</TableHead>
              <TableHead className="h-10 text-center w-24 text-muted-foreground uppercase tracking-wider text-xs">QTY</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Cost</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Expected Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ item, qty, totalCost, expected }) => {
              const positive = item.profitPerItem >= 0;
              return (
                <TableRow key={item.name} className="border-b border-border/40 hover:bg-secondary/30">
                  <TableCell className="py-2 font-medium text-gold">{item.name}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(item.craftingCost, 3)}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">{fmt(item.breakeven, 3)}</TableCell>
                  <TableCell className="py-2 text-center tabular-nums font-mono text-gold">
                    {fmt(item.AHPrice, 3)}
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono font-medium", positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {positive ? "+" : ""}{fmt(item.profitPerItem, 3)}
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono", item.ROI >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {fmt(item.ROI, 2)}%
                  </TableCell>
                  <TableCell className="py-2">
                    <QtyInput
                      value={qty}
                      onChange={(val) => setQty(item.name, val)}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(totalCost)}</TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono font-medium", expected >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {fmt(expected)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-secondary/50 border-t-2 border-primary/40 font-bold hover:bg-secondary/50">
              <TableCell className="py-3 font-display uppercase tracking-widest text-gold">Total</TableCell>
              <TableCell colSpan={5} />
              <TableCell className="py-3 text-center tabular-nums font-mono text-gold">{qtySum}</TableCell>
              <TableCell className="py-3 text-right tabular-nums font-mono text-gold">{fmt(totals.cost)}</TableCell>
              <TableCell className={cn("py-3 text-right tabular-nums font-mono", totals.expected >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                {fmt(totals.expected)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
