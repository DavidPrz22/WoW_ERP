import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BOE_ITEMS, PROFESSIONS } from "../utils/constants";
import type { Profession, BoeItem } from "../types/types";
import { ProfessionSection } from "./ProfessionSection";
import { BoeHeader } from "./BoeHeader";
import { NetherPriceSection } from "./NetherPriceSection";

export function Boes() {
  const [primalNether, setPrimalNether] = useState(85);
  const [netherVortex, setNetherVortex] = useState(120);

  const netherPrices = { primal: primalNether, vortex: netherVortex };

  const byProfession = useMemo(() => {
    const m: Record<Profession, BoeItem[]> = {
      Tailoring: [], Blacksmithing: [], Leatherworking: [], Engineering: [],
    };
    for (const it of BOE_ITEMS) m[it.profession].push(it);
    return m;
  }, []);

  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <BoeHeader 
        title="BOEs" 
        description="Bind-on-equip crafted gear, enhancements and consumables across professions." 
        icon={Package} 
      />

      <NetherPriceSection 
        primalNether={primalNether} 
        netherVortex={netherVortex} 
        onPrimalChange={setPrimalNether} 
        onVortexChange={setNetherVortex} 
      />

      {/* Profession tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-card/40 border border-border/70">
          <TabsTrigger value="all" className="uppercase tracking-wider text-xs data-[state=active]:text-gold">
            All
          </TabsTrigger>
          {PROFESSIONS.map((p) => (
            <TabsTrigger key={p} value={p} className="uppercase tracking-wider text-xs data-[state=active]:text-gold">
              {p}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0 space-y-8">
          {PROFESSIONS.map((p) => (
            <ProfessionSection key={p} profession={p} items={byProfession[p]} netherPrices={netherPrices} />
          ))}
        </TabsContent>

        {PROFESSIONS.map((p) => (
          <TabsContent key={p} value={p} className="mt-0">
            <ProfessionSection profession={p} items={byProfession[p]} netherPrices={netherPrices} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
