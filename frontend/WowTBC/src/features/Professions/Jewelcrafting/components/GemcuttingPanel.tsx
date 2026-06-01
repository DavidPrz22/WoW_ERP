import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AH_CUT } from "../utils/constants";
import { GemcuttingSectionTable } from "./GemcuttingSectionTable";
import type { JewelcraftingCutGem } from "../types/types";

interface GemcuttingPanelProps {
  cutGems: JewelcraftingCutGem[] | null;
  AhPrices: Record<string, number>;
  prospectingPrices: Record<string, number>;
}

const COLOR_MAP: Record<string, string> = {
  Red: "bg-[hsl(0_72%_45%)]",
  Yellow: "bg-[hsl(48_90%_55%)]",
  Blue: "bg-[hsl(214_80%_50%)]",
  Orange: "bg-[hsl(24_90%_55%)]",
  Green: "bg-[hsl(142_55%_40%)]",
  Purple: "bg-[hsl(280_55%_45%)]",
};

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

export function GemcuttingPanel({ cutGems, AhPrices, prospectingPrices }: GemcuttingPanelProps) {
  const [useProspectPrices, setUseProspectPrices] = useState(false);
  const [cutPrices, setCutPrices] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    for (const c of cutGems ?? []) {
      m[c.name] = c.ahPrice ?? 0;
    }
    return m;
  });

  const sections = groupByColorAndGem(cutGems ?? []);

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

      {sections.map((section) => {
        
        const fallbackCost = section.items[0]?.craftingCost ?? 0;
        const gemCostCopper = useProspectPrices
          ? prospectingPrices[section.gem] ?? fallbackCost
          : AhPrices[section.gem] ?? fallbackCost;
  
        const gemCost = gemCostCopper / 10000;
        const breakeven = gemCost / (1 - AH_CUT);

        return (
          <GemcuttingSectionTable
            key={`${section.color}|${section.gem}`}
            color={section.color}
            colorClass={section.colorClass}
            gem={section.gem}
            items={section.items}
            cost={gemCost}
            breakeven={breakeven}
            cutPrices={cutPrices}
            setCutPrices={setCutPrices}
          />
        );
      })}
    </div>
  );
}