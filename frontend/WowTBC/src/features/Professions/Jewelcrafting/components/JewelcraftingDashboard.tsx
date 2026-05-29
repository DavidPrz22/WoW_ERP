import { useState } from "react";
import { Gem } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priceMap, PROSPECT_RESULTS } from "../utils/constants";
import { ProspectingPanel } from "./ProspectingPanel";
import { GemcuttingPanel } from "./GemcuttingPanel";

export function JewelcraftingDashboard() {
  const [prospectAhPrices, setProspectAhPrices] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    for (const r of PROSPECT_RESULTS) {
      m[r.name] = priceMap[r.name] ?? 0;
    }
    return m;
  });

  const setAhPrice = (name: string, v: number) =>
    setProspectAhPrices((p) => ({ ...p, [name]: v }));

  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-md bg-gradient-gold shadow-gold flex items-center justify-center text-primary-foreground">
          <Gem className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-display text-4xl text-gold">Jewelcrafting</h1>
          <p className="text-muted-foreground text-sm">
            Prospect ore and cut gems — track costs, margins and profits.
          </p>
        </div>
      </div>

      <Tabs defaultValue="prospecting" className="space-y-6">
        <TabsList className="bg-card/40 border border-border/70">
          <TabsTrigger value="prospecting" className="uppercase tracking-wider text-xs data-[state=active]:text-gold">
            Prospecting
          </TabsTrigger>
          <TabsTrigger value="gemcutting" className="uppercase tracking-wider text-xs data-[state=active]:text-gold">
            Gemcutting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prospecting" className="mt-0">
          <ProspectingPanel ahPrices={prospectAhPrices} setAhPrice={setAhPrice} />
        </TabsContent>

        <TabsContent value="gemcutting" className="mt-0">
          <GemcuttingPanel prospectAhPrices={prospectAhPrices} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
