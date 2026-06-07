import { useMemo, useState, useEffect } from "react";
import { Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BoeApiProfession, NetherInput, NetherPrices } from "../types/types";
import { ProfessionSection } from "./ProfessionSection";
import { BoeHeader } from "./BoeHeader";
import { NetherPriceSection } from "./NetherPriceSection";
import { BoeRecordSelects } from "./BoeRecordSelects";
import { useBoeStore } from "@/ZustandStores/useBoeStore";
import { useBoeData } from "../hooks/queries/queries";
import { BoeEmptyState } from "./BoeEmptyState";

export function Boes() {
  const { dataFaction, dataRealm, dataRecordId, setBoeData } = useBoeStore();

  const { data: apiResponse, isLoading } = useBoeData({
    realm: dataRealm,
    faction: dataFaction,
    record_id: dataRecordId ? parseInt(dataRecordId, 10) : 0,
  });

  useEffect(() => {
    if (apiResponse?.data) {
      setBoeData(apiResponse.data);
    }
  }, [apiResponse, setBoeData]);

  const boeData = useMemo(() => apiResponse?.data ?? [], [apiResponse?.data]);

  const netherTypesNeeded = useMemo(() => {
    const types = new Set<NetherInput>();
    for (const prof of boeData) {
      for (const cat of prof.items) {
        for (const item of cat.items) {
          for (const reagent of item.reagents) {
            if (reagent.is_nether_input) {
              types.add(reagent.is_nether_input);
            }
          }
        }
      }
    }
    return types;
  }, [boeData]);

  const [primalNether, setPrimalNether] = useState(100);
  const [netherVortex, setNetherVortex] = useState(1000);

  const netherPrices: NetherPrices = {
    primal: primalNether,
    vortex: netherVortex,
  };

  const allProfessions = useMemo(() => {
    return boeData.map((p: BoeApiProfession) => p.profession);
  }, [boeData]);

  const hasData = boeData.length > 0 && !isLoading;
  const shouldShowContent = dataFaction && dataRealm && dataRecordId;

  if (!shouldShowContent) {
    return (
      <div className="px-6 md:px-12 py-10 space-y-8">
        <BoeHeader
          title="BOEs"
          description="Bind-on-equip crafted gear, enhancements and consumables across professions."
          icon={Package}
        />
        <BoeRecordSelects />
        <BoeEmptyState message="Select a faction, realm, and record to view BOE data." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-6 md:px-12 py-10 space-y-8">
        <BoeHeader
          title="BOEs"
          description="Bind-on-equip crafted gear, enhancements and consumables across professions."
          icon={Package}
        />
        <BoeRecordSelects />
        <div className="flex items-center justify-center py-20 text-muted-foreground">Loading BOE data...</div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <BoeHeader
        title="BOEs"
        description="Bind-on-equip crafted gear, enhancements and consumables across professions."
        icon={Package}
      />

      <BoeRecordSelects />

      {netherTypesNeeded.size > 0 && (
        <NetherPriceSection
          primalNether={primalNether}
          netherVortex={netherVortex}
          onPrimalChange={setPrimalNether}
          onVortexChange={setNetherVortex}
          showPrimal={netherTypesNeeded.has("primal")}
          showVortex={netherTypesNeeded.has("vortex")}
        />
      )}

      {!hasData ? (
        <BoeEmptyState message="No BOE data found for the selected record." />
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-card/40 border border-border/70">
            <TabsTrigger value="all" className="uppercase tracking-wider text-xs data-[state=active]:text-gold">
              All
            </TabsTrigger>
            {allProfessions.map((p) => (
              <TabsTrigger key={p} value={p} className="uppercase tracking-wider text-xs data-[state=active]:text-gold">
                {p}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-0 space-y-8">
            {boeData.map((prof: BoeApiProfession) => (
              <ProfessionSection key={prof.profession} profession={prof} netherPrices={netherPrices} />
            ))}
          </TabsContent>

          {boeData.map((prof: BoeApiProfession) => (
            <TabsContent key={prof.profession} value={prof.profession} className="mt-0">
              <ProfessionSection profession={prof} netherPrices={netherPrices} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
