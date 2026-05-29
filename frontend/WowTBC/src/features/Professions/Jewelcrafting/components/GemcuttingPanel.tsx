import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AH_CUT, priceMap, CUT_SECTIONS } from "../utils/constants";
import { fmt } from "../utils/helpers";

interface GemcuttingPanelProps {
  prospectAhPrices: Record<string, number>;
}

export function GemcuttingPanel({ prospectAhPrices }: GemcuttingPanelProps) {
  const [useProspectPrices, setUseProspectPrices] = useState(false);
  const [cutPrices, setCutPrices] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    for (const s of CUT_SECTIONS) {
      for (const c of s.cuts) {
        m[c.name] = c.ahPrice;
      }
    }
    return m;
  });

  const gemCost = (gem: string) =>
    useProspectPrices ? prospectAhPrices[gem] ?? priceMap[gem] ?? 0 : priceMap[gem] ?? 0;

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between border border-border/70 bg-card/40 px-5 py-4 shadow-panel">
        <div>
          <div className="font-display text-sm text-gold uppercase tracking-[0.2em]">
            Use Prospecting Prices
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Replace gem AH cost with the values you entered in the Prospecting tab.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="use-prospect" className="text-xs uppercase tracking-wider text-muted-foreground">
            {useProspectPrices ? "On" : "Off"}
          </Label>
          <Switch
            id="use-prospect"
            checked={useProspectPrices}
            onCheckedChange={setUseProspectPrices}
          />
        </div>
      </div>

      {CUT_SECTIONS.map((section) => {
        const cost = gemCost(section.gem);
        const breakeven = cost / (1 - AH_CUT);
        return (
          <section key={section.key} className="space-y-3">
            <div className="flex items-stretch border border-border/70 bg-card/40 shadow-panel overflow-hidden">
              <div className={cn("w-2", section.color)} />
              <div className="px-4 py-2 font-display text-sm text-gold uppercase tracking-[0.2em]">
                {section.label}
                <span className="ml-3 text-xs normal-case tracking-normal text-muted-foreground">
                  {section.gem} · {fmt(cost, 4)}g
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
                  {section.cuts.map((c) => {
                    const ah = cutPrices[c.name] ?? 0;
                    const profit = ah * (1 - AH_CUT) - cost;
                    const roi = cost > 0 ? (profit / cost) * 100 : 0;
                    const positive = profit >= 0;
                    return (
                      <TableRow key={c.name} className="border-b border-border/40 hover:bg-secondary/30">
                        <TableCell className="py-2 font-medium text-gold">{c.name}</TableCell>
                        <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(cost, 4)}</TableCell>
                        <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
                          {fmt(breakeven, 4)}
                        </TableCell>
                        <TableCell className="py-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={ah}
                            onChange={(e) =>
                              setCutPrices((p) => ({ ...p, [c.name]: parseFloat(e.target.value) || 0 }))
                            }
                            className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                          />
                        </TableCell>
                        <TableCell className={cn("py-2 text-right tabular-nums font-mono font-medium", positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                          {positive ? "+" : ""}{fmt(profit, 4)}
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
      })}
    </div>
  );
}
