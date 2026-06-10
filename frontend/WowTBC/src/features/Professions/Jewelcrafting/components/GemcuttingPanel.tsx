import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useJewelcraftingStore } from "@/ZustandStores/useJewelcraftingStore";
import { GemcuttingSectionTable } from "./GemcuttingSectionTable";
import { JewelcraftingSummaryCards } from "./JewelcraftingSummaryCards";
import type { JewelcraftingCutGem } from "../types/types";
import { COLOR_MAP, AH_CUT } from "../utils/constants";


interface CutSection {
  color: string;
  colorClass: string;
  gem: string;
  items: JewelcraftingCutGem[];
}


function groupByColorAndGem(cuts: JewelcraftingCutGem[]): CutSection[] {
  const groups: Record<string, CutSection> = {};
  for (const cut of cuts) {
    const key = `${cut.color}|${cut.rawGem}`;
    if (!groups[key]) {
      groups[key] = {
        color: cut.color,
        colorClass: COLOR_MAP[cut.color] ?? "bg-gray-500",
        gem: cut.rawGem,
        items: [],
      };
    }
    groups[key].items.push(cut);
  }
  return Object.values(groups);
}

export function GemcuttingPanel({ cutGems, AhPrices, prospectingPrices }: { cutGems: JewelcraftingCutGem[] | null; AhPrices: Record<string, number>; prospectingPrices: Record<string, number> }) {
  const { quantities, setQty } = useJewelcraftingStore();
  const [useProspectPrices, setUseProspectPrices] = useState(false);
  const [cutPrices, setCutPrices] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    for (const c of cutGems ?? []) {
      m[c.name] = c.ahPrice ?? 0;
    }
    return m;
  });

  const sections = groupByColorAndGem(cutGems ?? []);

  const grand = useMemo(() => {
    let cost = 0;
    let profit = 0;

    for (const section of sections) {
      const gemCostCopper = useProspectPrices
        ? prospectingPrices[section.gem] ?? (section.items[0]?.craftingCost ?? 0)
        : AhPrices[section.gem] ?? (section.items[0]?.craftingCost ?? 0);
      const gemCost = gemCostCopper / 10000;

      for (const item of section.items) {
        const qty = quantities[item.name] ?? 0;
        if (qty <= 0) continue;

        const rowCost = gemCost;
        const ahCopperInput = cutPrices[item.name] ?? item.ahPrice ?? 0;
        const ah = ahCopperInput / 10000;
        const profitPerItem = ah * (1 - AH_CUT) - rowCost;
        cost += rowCost * qty;
        profit += profitPerItem * qty;
      }
    }

    return { cost: cost * 10000, profit: profit * 10000 };
  }, [sections, useProspectPrices, prospectingPrices, AhPrices, cutPrices, quantities]);

  return (
    <div className="space-y-6">
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

      <JewelcraftingSummaryCards grand={grand} />

      {sections.map((section) => {
        
        const fallbackCost = section.items[0]?.craftingCost ?? 0;
        const gemCostCopper = useProspectPrices
          ? prospectingPrices[section.gem] ?? fallbackCost
          : AhPrices[section.gem] ?? fallbackCost;
  
        const gemCost = gemCostCopper / 10000;

        return (
          <GemcuttingSectionTable
            key={`${section.color}|${section.gem}`}
            color={section.color}
            colorClass={section.colorClass}
            gem={section.gem}
            items={section.items}
            cost={gemCost}
            cutPrices={cutPrices}
            setCutPrices={setCutPrices}
            quantities={quantities}
            setQty={setQty}
          />
        );
      })}
    </div>
  );
}
