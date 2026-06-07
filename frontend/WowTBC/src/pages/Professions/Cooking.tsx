import { Fragment, useState } from "react";
import { UtensilsCrossed } from "lucide-react";
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

const AH_CUT = 0.05;

type BuffType = "AGI" | "SP" | "STA" | "STR" | "HEAL" | "HIT" | "PET";

type Recipe = {
  name: string;
  buff: BuffType;
  craftingCost: number;
  ahPrice: number;
};

const BUFF_META: Record<BuffType, { label: string; color: string; dot: string }> = {
  AGI:  { label: "Agility",      color: "bg-[hsl(142_55%_50%)]", dot: "bg-[hsl(142_55%_50%)]" },
  SP:   { label: "Spell Power",  color: "bg-[hsl(214_80%_55%)]", dot: "bg-[hsl(214_80%_55%)]" },
  STA:  { label: "Stamina",      color: "bg-[hsl(0_72%_45%)]",   dot: "bg-[hsl(0_72%_45%)]" },
  STR:  { label: "Strength",     color: "bg-[hsl(24_60%_45%)]",  dot: "bg-[hsl(24_60%_45%)]" },
  HEAL: { label: "Healing",      color: "bg-[hsl(48_70%_50%)]",  dot: "bg-[hsl(48_70%_50%)]" },
  HIT:  { label: "Hit Rating",   color: "bg-[hsl(280_55%_60%)]", dot: "bg-[hsl(280_55%_60%)]" },
  PET:  { label: "Pet",          color: "bg-[hsl(180_55%_45%)]", dot: "bg-[hsl(180_55%_45%)]" },
};

const ORDER: BuffType[] = ["AGI", "SP", "STA", "STR", "HEAL", "HIT", "PET"];

const RECIPES: Recipe[] = [
  { name: "Warp Burger",        buff: "AGI",  craftingCost: 0.594,  ahPrice: 0.8035 },
  { name: "Grilled Mudfish",    buff: "AGI",  craftingCost: 0.2992, ahPrice: 0.3446 },
  { name: "Crunchy Serpent",    buff: "SP",   craftingCost: 0.9398, ahPrice: 1.2247 },
  { name: "Poached Bluefish",   buff: "SP",   craftingCost: 0.9475, ahPrice: 0.9855 },
  { name: "Blackened Basilisk", buff: "SP",   craftingCost: 0.769,  ahPrice: 0.9625 },
  { name: "Spicy Crawdad",      buff: "STA",  craftingCost: 0.6862, ahPrice: 0.7386 },
  { name: "Fisherman's Feast",  buff: "STA",  craftingCost: 0,      ahPrice: 0 },
  { name: "Roasted Clefthoof",  buff: "STR",  craftingCost: 0.4223, ahPrice: 0.5041 },
  { name: "Golden Fish Sticks", buff: "HEAL", craftingCost: 1.1081, ahPrice: 1.2261 },
  { name: "Kibler's Bits",      buff: "PET",  craftingCost: 0.17,   ahPrice: 0.3996 },
  { name: "Spicy Hot Talbuk",   buff: "HIT",  craftingCost: 0.417,  ahPrice: 0.6041 },
];

function fmt(n: number, d = 4) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function Cooking() {
  const [qty, setQty] = useState<Record<string, number>>({});

  const grouped = ORDER.map((buff) => ({
    buff,
    items: RECIPES.filter((r) => r.buff === buff),
  })).filter((g) => g.items.length > 0);

  let totalProfit = 0;
  for (const r of RECIPES) {
    const profitPerItem = r.ahPrice > 0 ? r.ahPrice * (1 - AH_CUT) - r.craftingCost : 0;
    totalProfit += profitPerItem * (qty[r.name] ?? 0);
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="h-6 w-6 text-gold" />
          <h1 className="font-display text-2xl text-gold uppercase tracking-[0.2em]">Cooking</h1>
        </div>
        <p className="text-sm text-muted-foreground">Buff foods for raids and PvP.</p>
      </header>

      <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="bg-secondary/50 border-b border-primary/20 hover:bg-secondary/50">
              <TableHead className="h-10 uppercase tracking-wider text-xs">Item</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven</TableHead>
              <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-28">AH Price</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit / Item</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
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
                    const breakeven = r.craftingCost / (1 - AH_CUT);
                    const profit = noAh ? 0 : r.ahPrice * (1 - AH_CUT) - r.craftingCost;
                    const roi = r.craftingCost > 0 && !noAh ? (profit / r.craftingCost) * 100 : 0;
                    const positive = profit >= 0;
                    const q = qty[r.name] ?? 0;
                    const expected = profit * q;
                    return (
                      <TableRow key={r.name} className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
                        <TableCell className="py-2 font-medium text-gold">{r.name}</TableCell>
                        <TableCell className="py-2 text-right tabular-nums font-mono">
                          {noAh ? <span className="text-muted-foreground/60">—</span> : fmt(r.craftingCost)}
                        </TableCell>
                        <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
                          {noAh ? <span className="text-muted-foreground/60">—</span> : fmt(breakeven)}
                        </TableCell>
                        <TableCell className="py-2 text-center tabular-nums font-mono text-gold">
                          {noAh ? <span className="text-muted-foreground/60">—</span> : fmt(r.ahPrice, 4)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "py-2 text-right tabular-nums font-mono font-medium",
                            noAh ? "text-muted-foreground/60" : positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
                          )}
                        >
                          {noAh ? "—" : `${positive ? "+" : ""}${fmt(profit, 4)}`}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "py-2 text-right tabular-nums font-mono",
                            noAh ? "text-muted-foreground/60" : roi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
                          )}
                        >
                          {noAh ? "—" : `${fmt(roi, 4)}%`}
                        </TableCell>
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
                          {q > 0 && !noAh ? `${expected > 0 ? "+" : ""}${fmt(expected, 4)}` : "—"}
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
                {`${totalProfit > 0 ? "+" : ""}${fmt(totalProfit, 4)}`}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
