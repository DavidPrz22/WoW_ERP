import { Gem } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJewelcraftingStore } from "@/ZustandStores/useJewelcraftingStore.ts";
import { useJewelcraftingItems } from "../hooks/queries/queries";
import { ProspectingPanel } from "./ProspectingPanel";
import { GemcuttingPanel } from "./GemcuttingPanel";
import { JewelcraftingRecordSelects } from "./JewelcraftingRecordSelects";
import { useEffect } from "react";
import { round } from "../../../../utils/helpers";

export function JewelcraftingDashboard() {
  const {
    dataFaction,
    dataRealm,
    dataRecordId,
    rawGems,
    cutGems,
    prospectAhPrices,
    prospectPrices,
    setRawGems,
    setCutGems,
    setProspectAhPrices,
    setProspectPrices,
  } = useJewelcraftingStore();

  const { data: recordData } = useJewelcraftingItems({
    faction: dataFaction,
    realm: dataRealm,
    record_id: dataRecordId ? parseInt(dataRecordId) : 0,
  });

  useEffect(() => {
    if (!recordData) return;
    setRawGems(recordData.raw_gems);
    setCutGems(recordData.cut_gems);
  }, [recordData, setRawGems, setCutGems]);

  useEffect(() => {
    if (!rawGems) return;
    const ahMap: Record<string, number> = {};
    const ppMap: Record<string, number> = {};
    for (const gem of rawGems) {
      ahMap[gem.name] = gem.ahPrice ?? 0;
      ppMap[gem.name] = gem.ahPrice ?? 0;
    }
    setProspectAhPrices(ahMap);
    setProspectPrices(ppMap);
  }, [rawGems, setProspectAhPrices, setProspectPrices]);

  const setAhPrice = (name: string, v: number) =>
    setProspectAhPrices((p) => ({ ...p, [name]: round(v, 3) }));

  const setProspectPrice = (name: string, cantidad: number, subtotal?: number) => {
    if (subtotal === undefined) {
      setProspectPrices((p) => ({ ...p, [name]: round(cantidad * 10000, 3) }));
      return;
    }
    const goldPrice = subtotal / cantidad;
    const roundedGoldPrice = round(goldPrice, 3);
    const newUnitPrice = roundedGoldPrice * 10000;
    setProspectPrices((p) => ({ ...p, [name]: newUnitPrice }));
  };

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

      <JewelcraftingRecordSelects />

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
          <ProspectingPanel
            rawGems={rawGems}
            ahPrices={prospectAhPrices}
            prospectPrices={prospectPrices}
            setAhPrice={setAhPrice}
            setProspectPrice={setProspectPrice}
          />
        </TabsContent>

        <TabsContent value="gemcutting" className="mt-0">
          <GemcuttingPanel
            cutGems={cutGems}
            AhPrices={prospectAhPrices}
            prospectingPrices={prospectPrices}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}