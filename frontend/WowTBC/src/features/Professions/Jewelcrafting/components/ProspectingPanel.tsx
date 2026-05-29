import { useState } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  AH_CUT,
  priceMap,
  PROSPECT_ORE,
  PROSPECT_PER_BATCH,
  PROSPECT_RESULTS,
} from "../utils/constants";
import { fmt } from "../utils/helpers";
import { MetricCard } from "./MetricCard";
import { Row } from "./Row";

interface ProspectingPanelProps {
  ahPrices: Record<string, number>;
  setAhPrice: (name: string, v: number) => void;
}

export function ProspectingPanel({ ahPrices, setAhPrice }: ProspectingPanelProps) {
  const [oreCost, setOreCost] = useState(priceMap[PROSPECT_ORE] ?? 1.05);
  const [oreOwned, setOreOwned] = useState(1000);
  const [vendorEnabled, setVendorEnabled] = useState(true);
  const [obtenidoOverrides, setObtenidoOverrides] = useState<Record<string, number>>({});
  const [prospectPrices, setProspectPrices] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    for (const r of PROSPECT_RESULTS) {
      m[r.name] = priceMap[r.name] ?? 0;
    }
    return m;
  });

  const costToCraft = oreCost; // per ore prospected
  const subtotal = oreOwned * costToCraft;

  const rows = PROSPECT_RESULTS.map((r) => {
    const ah = ahPrices[r.name] ?? 0;
    const vendor = vendorEnabled ? r.vendor : undefined;
    const sellPrice = vendor ?? ah * (1 - AH_CUT);
    const profit = sellPrice * r.expected;
    const defaultObtenido = Math.round((oreOwned / PROSPECT_PER_BATCH) * r.chance);
    const obtenido = obtenidoOverrides[r.name] ?? defaultObtenido;
    const precio = obtenido * (vendor ?? ah);
    const prospectPrice = prospectPrices[r.name] ?? 0;
    return { ...r, ah, vendor, profit, obtenido, precio, prospectPrice };
  });

  const totalReal = rows.reduce((a, b) => a + b.precio, 0);
  const breakEven = subtotal / Math.max(rows.reduce((a, b) => a + b.profit, 0), 0.0001);
  const pl = totalReal - subtotal;

  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Ore">
          <div className="space-y-2">
            <Row label="Cost">
              <Input
                type="number"
                step="0.01"
                value={oreCost}
                onChange={(e) => setOreCost(parseFloat(e.target.value) || 0)}
                className="h-8 w-28 text-right tabular-nums font-mono bg-background border-border/70 text-gold"
              />
            </Row>
            <Row label="Cost to Craft">
              <span className="font-mono tabular-nums text-gold">{fmt(costToCraft, 2)}</span>
            </Row>
            <Row label="Subtotal">
              <span className="font-mono tabular-nums text-gold">{fmt(subtotal, 2)}</span>
            </Row>
          </div>
        </MetricCard>

        <MetricCard label="Break Even">
          <div className="font-display text-3xl text-gold tabular-nums">{fmt(breakEven, 4)}</div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
            ore-to-profit ratio
          </p>
        </MetricCard>

        <MetricCard label="Inventory">
          <Row label="How much ore?">
            <Input
              type="number"
              value={oreOwned}
              onChange={(e) => setOreOwned(parseInt(e.target.value) || 0)}
              className="h-8 w-28 text-right tabular-nums font-mono bg-background border-border/70 text-gold"
            />
          </Row>
          <Row label="Total Real">
            <span className="font-mono tabular-nums text-gold">{fmt(totalReal, 2)}</span>
          </Row>
          <Row label="P/L">
            <span className={cn("font-mono tabular-nums font-medium", pl >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
              {pl >= 0 ? "+" : ""}{fmt(pl, 2)}
            </span>
          </Row>
        </MetricCard>
      </div>

      {/* Results table */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-gold uppercase tracking-[0.2em] border-l-4 border-primary pl-4">
          Estimate Results
        </h2>
        <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="bg-secondary/40 border-b border-border/70 hover:bg-secondary/40">
                <TableHead className="h-10 uppercase tracking-wider text-xs">Gem</TableHead>
                <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Chance</TableHead>
                <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Expected</TableHead>
                <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">AH Price</TableHead>
                <TableHead className="h-10 text-right uppercase tracking-wider text-xs">
                  <div className="flex items-center justify-end gap-2">
                    <span>Vendor</span>
                    <Switch
                      checked={vendorEnabled}
                      onCheckedChange={setVendorEnabled}
                      className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3"
                    />
                  </div>
                </TableHead>
                <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">Prospecting Price</TableHead>
                <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit</TableHead>
                <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-28">Obtenido</TableHead>
                <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name} className="border-b border-border/40 hover:bg-secondary/30">
                  <TableCell className="py-2 font-medium text-gold">{r.name}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
                    {(r.chance * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(r.expected, 2)}</TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={r.ah}
                      onChange={(e) => setAhPrice(r.name, parseFloat(e.target.value) || 0)}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono", vendorEnabled ? "text-muted-foreground" : "text-muted-foreground/40")}>
                    {r.vendor ? fmt(r.vendor, 2) : "—"}
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={r.prospectPrice}
                      onChange={(e) =>
                        setProspectPrices((p) => ({ ...p, [r.name]: parseFloat(e.target.value) || 0 }))
                      }
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-[hsl(var(--quality-uncommon))]">
                    {fmt(r.profit, 2)}
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      value={r.obtenido}
                      onChange={(e) =>
                        setObtenidoOverrides((p) => ({ ...p, [r.name]: parseInt(e.target.value) || 0 }))
                      }
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-gold">{fmt(r.precio, 2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-secondary/50 border-t-2 border-primary/40 hover:bg-secondary/50">
                <TableCell colSpan={6} className="py-3 font-bold text-gold uppercase tracking-wider text-xs">Total</TableCell>
                <TableCell className="py-3 text-right tabular-nums font-mono font-bold text-gold">
                  {fmt(rows.reduce((a, b) => a + b.profit, 0), 2)}
                </TableCell>
                <TableCell />
                <TableCell className="py-3 text-right tabular-nums font-mono font-bold text-gold">
                  {fmt(totalReal, 2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>
    </div>
  );
}
