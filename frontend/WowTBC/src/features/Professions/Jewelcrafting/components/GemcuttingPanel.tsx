import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AH_CUT, priceMap, CUT_SECTIONS } from "../utils/constants";
import { GemcuttingSectionTable } from "./GemcuttingSectionTable";

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
          <GemcuttingSectionTable
            key={section.key}
            section={section}
            cost={cost}
            breakeven={breakeven}
            cutPrices={cutPrices}
            setCutPrices={setCutPrices}
          />
        );
      })}
    </div>
  );
}
