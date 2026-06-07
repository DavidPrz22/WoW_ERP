import { useState } from "react";
import { Wrench, Bomb } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const AH_CUT = 0.05;

type EngItem = {
  name: string;
  craftingCost: number;
  ahPrice: number;
  reagentCost?: number;
};

const PARTS: EngItem[] = [
  { name: "Fel Iron Casing", craftingCost: 2.6376, ahPrice: 2.336 },
  { name: "Handful of Fel Iron Bolts", craftingCost: 0.8792, ahPrice: 1.0305 },
  { name: "Elemental Blasting Powder", craftingCost: 0.499675, ahPrice: 0.9285 },
  { name: "Hardened Adamantite Tube", craftingCost: 28.4912, ahPrice: 32.5 },
  { name: "Khorium Power Core", craftingCost: 14.221, ahPrice: 17.998 },
];

const EXPLOSIVES: EngItem[] = [
  { name: "Sapper Charge", craftingCost: 7.3111, ahPrice: 9.6968, reagentCost: 8.9912 },
  { name: "Adamantite Grenade", craftingCost: 5.8821, ahPrice: 7.2299, reagentCost: 7.1182 },
  { name: "Fel Iron Bomb", craftingCost: 5.1448, ahPrice: 6.9988, reagentCost: 6.3389 },
  { name: "Super Sapper Charge", craftingCost: 24.6791, ahPrice: 32.999, reagentCost: 28.8421 },
  { name: "The Bigger One", craftingCost: 11.5712, ahPrice: 15.4992, reagentCost: 13.4818 },
];

function fmt(n: number, d = 4) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

type Row = { name: string; cost: number; ah: number };

function calc(r: Row) {
  const breakeven = r.cost / (1 - AH_CUT);
  const profit = r.ah > 0 ? r.ah * (1 - AH_CUT) - r.cost : 0;
  const roi = r.cost > 0 && r.ah > 0 ? (profit / r.cost) * 100 : 0;
  return { breakeven, profit, roi };
}

function SectionHeader({
  title,
  icon: Icon,
  accent,
  count,
}: {
  title: string;
  icon: typeof Wrench;
  accent: string;
  count: number;
}) {
  return (
    <div className="flex items-stretch border border-border/70 bg-card/40 shadow-panel overflow-hidden">
      <div className={cn("w-2", accent)} />
      <div className="px-4 py-3 flex items-center gap-3 flex-1">
        <Icon className="h-4 w-4 text-gold" />
        <div className="font-display text-base text-gold uppercase tracking-[0.2em]">{title}</div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 bg-secondary/60 border border-border/40 rounded-sm px-2 py-0.5">
          {count} items
        </span>
      </div>
    </div>
  );
}

function ResultCells({ row }: { row: Row }) {
  const { breakeven, profit, roi } = calc(row);
  const noAh = row.ah <= 0;
  const positive = profit >= 0;
  return (
    <>
      <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(row.cost)}</TableCell>
      <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
        {fmt(breakeven)}
      </TableCell>
      <TableCell className="py-2 text-center tabular-nums font-mono text-gold">
        {noAh ? <span className="text-muted-foreground/60">—</span> : fmt(row.ah, 4)}
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
    </>
  );
}

function PartsTable() {
  return (
    <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="bg-secondary/50 border-b border-primary/20 hover:bg-secondary/50">
            <TableHead className="h-10 uppercase tracking-wider text-xs">Item</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven</TableHead>
            <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">AH Price</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit / Item</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PARTS.map((it) => (
            <TableRow key={it.name} className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
              <TableCell className="py-2 font-medium text-gold">{it.name}</TableCell>
              <ResultCells row={{ name: it.name, cost: it.craftingCost, ah: it.ahPrice }} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ExplosivesTable() {
  const [buyReagents, setBuyReagents] = useState<Record<string, boolean>>({});

  return (
    <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="bg-secondary/50 border-b border-primary/20 hover:bg-secondary/50">
            <TableHead className="h-10 uppercase tracking-wider text-xs">Item</TableHead>
            <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-28">Buy Reagents</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven</TableHead>
            <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">AH Price</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit / Item</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {EXPLOSIVES.map((it) => {
            const buying = !!buyReagents[it.name];
            const cost = buying && it.reagentCost ? it.reagentCost : it.craftingCost;
            return (
              <TableRow key={it.name} className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
                <TableCell className="py-2 font-medium text-gold">
                  <div className="flex items-center gap-2">
                    <span>{it.name}</span>
                    {buying && (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider px-2 py-0.5 border border-primary/30 text-primary/90 bg-primary/10 rounded-sm">
                        <span className="w-1 h-1 rounded-full bg-primary/70" />
                        Buying
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-center">
                  <div className="flex justify-center">
                    <Switch
                      checked={buying}
                      onCheckedChange={(v) => setBuyReagents((s) => ({ ...s, [it.name]: v }))}
                    />
                  </div>
                </TableCell>
                <ResultCells row={{ name: it.name, cost, ah: it.ahPrice }} />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Engineering() {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <Wrench className="h-6 w-6 text-gold" />
          <h1 className="font-display text-2xl text-gold uppercase tracking-[0.2em]">Engineering</h1>
        </div>
        <p className="text-sm text-muted-foreground">Gadgets, scopes, and explosives.</p>
      </header>

      <section className="space-y-4">
        <SectionHeader title="Parts" icon={Wrench} accent="bg-[hsl(48_70%_45%)]" count={PARTS.length} />
        <PartsTable />
      </section>

      <section className="space-y-4">
        <SectionHeader title="Explosives" icon={Bomb} accent="bg-[hsl(0_72%_45%)]" count={EXPLOSIVES.length} />
        <ExplosivesTable />
      </section>
    </div>
  );
}
