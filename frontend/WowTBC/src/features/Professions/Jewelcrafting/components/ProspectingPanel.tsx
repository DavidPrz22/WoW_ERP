import { useState } from "react";
import { Input } from "@/components/ui/input";
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
import { ProspectingResultsTable } from "./ProspectingResultsTable";

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

      <ProspectingResultsTable
        rows={rows}
        vendorEnabled={vendorEnabled}
        setVendorEnabled={setVendorEnabled}
        setAhPrice={setAhPrice}
        setProspectPrices={setProspectPrices}
        setObtenidoOverrides={setObtenidoOverrides}
        totalReal={totalReal}
      />
    </div>
  );
}
