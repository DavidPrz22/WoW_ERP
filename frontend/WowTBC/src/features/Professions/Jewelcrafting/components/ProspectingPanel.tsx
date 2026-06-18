import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useJewelcraftingStore } from "@/ZustandStores/useJewelcraftingStore";
import {
  AH_CUT,
  PROSPECT_PER_BATCH,
} from "../utils/constants";
import { fmt } from "../utils/helpers";
import { MetricCard } from "./MetricCard";
import { Row } from "./Row";
import { ProspectingResultsTable } from "./ProspectingResultsTable";
import type { JewelcraftingRawGem } from "../types/types";

interface ProspectingPanelProps {
  rawGems: JewelcraftingRawGem[] | null;
  ahPrices: Record<string, number>;
  prospectPrices: Record<string, number>;
  setAhPrice: (name: string, v: number) => void;
  setProspectPrice: (name: string, v: number, subtotal?: number) => void;
}

export function ProspectingPanel({
  rawGems,
  ahPrices,
  prospectPrices,
  setAhPrice,
  setProspectPrice,
}: ProspectingPanelProps) {
  const [vendorEnabled, setVendorEnabled] = useState(false);
  const { oreOwned, oreCost, setOreOwned, setOreCost, obtenidoOverrides, setObtenidoOverrides } = useJewelcraftingStore();

  const costToCraft = oreCost;
  const subtotal = oreOwned * costToCraft;

  const rows = (rawGems ?? []).map((gem) => {
    const ahCopper = ahPrices[gem.name] ?? gem.ahPrice ?? 0;
    const ah = ahCopper / 10000;

    const sellPrice = vendorEnabled ? gem.vendorPrice / 10000 : ah * (1 - AH_CUT);
    const expected = Math.round((oreOwned / PROSPECT_PER_BATCH) * gem.procChance);
    const subtotal = sellPrice * expected;
    const defaultObtenido = Math.round((oreOwned / PROSPECT_PER_BATCH) * gem.procChance);
    const obtenido = obtenidoOverrides[gem.name] ?? defaultObtenido;
    const precioObtenido = obtenido * (vendorEnabled ? gem.vendorPrice / 10000 : ah * (1 - AH_CUT));
    const prospectPrice = (prospectPrices[gem.name] ?? 0) / 10000;

    return { ...gem, ah, vendor: gem.vendorPrice / 10000, subtotal, expected, obtenido, precioObtenido, prospectPrice };
  });

  const totalReal = rows.reduce((a, b) => a + b.precioObtenido, 0);
  const totalExpected = rows.reduce((a, b) => a + b.subtotal, 0); 
  const pl_expected = totalExpected - subtotal;
  const pl_real = totalReal - subtotal;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Ore">
          <div className="space-y-4">
            <Row label="Cost">
              <Input
                type="number"
                step="0.01"
                value={oreCost}
                onChange={(e) => setOreCost(parseFloat(e.target.value))}
                className="h-8 w-28 text-right tabular-nums font-mono bg-background border-border/70 text-gold"
              />
            </Row>
            <div className="space-y-1 ">
              <Row label="Cost to Craft">
                <span className="font-mono tabular-nums text-gold">{fmt(costToCraft, 2)}</span>
              </Row>
              <Row label="Subtotal">
                <span className="font-mono tabular-nums text-gold">{fmt(subtotal, 2)}</span>
              </Row>
            </div>
          </div>
        </MetricCard>

        <MetricCard label="Profitability">
          <div className="space-y-5 mt-6">
            <Row label="P&L Estimate">
              <span className={cn("font-mono tabular-nums font-medium", pl_expected >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                  {pl_expected >= 0 ? "+" : ""}{fmt(pl_expected, 2)}
                </span>
            </Row>
            <Row label="P&L Real">
              <span className={cn("font-mono tabular-nums font-medium", pl_real >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                  {pl_real >= 0 ? "+" : ""}{fmt(pl_real, 2)}
                </span>
            </Row>
          </div>
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
        </MetricCard>
      </div>

      <ProspectingResultsTable
        rows={rows}
        vendorEnabled={vendorEnabled}
        setVendorEnabled={setVendorEnabled}
        setAhPrice={setAhPrice}
        setProspectPrice={setProspectPrice}
        setObtenidoOverrides={setObtenidoOverrides}
        totalReal={totalReal}
      />
    </div>
  );
}