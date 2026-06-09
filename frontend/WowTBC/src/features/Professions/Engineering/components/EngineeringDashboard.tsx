import { Wrench, Bomb } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { SectionHeader } from "@/components/ui/data-table/SectionHeader";
import { PageHeader } from "@/components/ui/data-table/PageHeader";
import { PartsTable } from "./PartsTable";
import { ExplosivesTable } from "./ExplosivesTable";
import { EngineeringRecordSelects } from "./EngineeringRecordSelects";
import { EngineeringSummaryCards } from "./EngineeringSummaryCards";
import { ShoppingListDialog } from "./ShoppingListDialog";
import { useEngineeringStore } from "@/ZustandStores/useEngineeringStore";
import { useEngineeringData } from "../hooks/queries/queries";
import { calculateCraftingCost, calculateExplosiveCost, calculateProfitPerItem } from "../utils/helpers";

export function EngineeringDashboard() {
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const {
    dataFaction,
    dataRealm,
    dataRecordId,
    partsData,
    explosivesData,
    quantities,
    buyReagentsToggles,
    reagentList,
    setPartsData,
    setExplosivesData,
    setReagentList,
  } = useEngineeringStore();

  const { data: recordData, isLoading, error } = useEngineeringData({
    realm: dataRealm,
    faction: dataFaction,
    record_id: dataRecordId ? Number(dataRecordId) : 0,
  });

  useEffect(() => {
    if (!recordData) return;
    setPartsData(recordData.parts);
    setExplosivesData(recordData.explosives);
    setReagentList(recordData.total_reagents_used);
  }, [recordData, setPartsData, setExplosivesData, setReagentList]);

  const grand = useMemo(() => {
    let cost = 0;
    let profit = 0;
    const parts = partsData || [];

    for (const part of parts) {
      const qty = quantities[part.name] ?? 0;
      if (qty <= 0) continue;
      const craftingCost = calculateCraftingCost(part.reagents, part.yield_quantity);
      const ahPrice = part.overriden_min_buyout ?? part.min_buyout ?? 0;
      const profitPerItem = calculateProfitPerItem(ahPrice, craftingCost);
      const actualQty = qty * (part.yield_quantity || 1);
      cost += craftingCost * actualQty;
      profit += profitPerItem * actualQty;
    }

    for (const explosive of explosivesData || []) {
      const qty = quantities[explosive.name] ?? 0;
      if (qty <= 0) continue;
      const buying = !!buyReagentsToggles[explosive.name];
      const craftingCost = calculateExplosiveCost(explosive, parts, buying);
      const ahPrice = explosive.overriden_min_buyout ?? explosive.min_buyout ?? 0;
      const profitPerItem = calculateProfitPerItem(ahPrice, craftingCost);
      const actualQty = qty * (explosive.yield_quantity || 1);
      cost += craftingCost * actualQty;
      profit += profitPerItem * actualQty;
    }

    return { cost, profit };
  }, [partsData, explosivesData, quantities, buyReagentsToggles]);

  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader
          title="Engineering"
          description="Gadgets, scopes, and explosives."
          icon={Wrench}
        />
        <ShoppingListDialog
          open={shoppingListOpen}
          onOpenChange={setShoppingListOpen}
          reagentList={reagentList}
          qtys={quantities}
        />
      </div>

      <EngineeringRecordSelects />

      {error && (
        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
          Error loading engineering data. Please try again.
        </div>
      )}

      {isLoading && (
        <div className="p-8 text-center text-muted-foreground">Loading engineering data...</div>
      )}

      {!isLoading && !error && (partsData || explosivesData) && (
        <>
          <EngineeringSummaryCards grand={grand} />

          <section className="space-y-4">
            <SectionHeader title="Parts" icon={Wrench} accent="bg-[hsl(48_70%_45%)]" count={partsData?.length || 0} />
            <PartsTable />
          </section>

          <section className="space-y-4">
            <SectionHeader title="Explosives" icon={Bomb} accent="bg-[hsl(0_72%_45%)]" count={explosivesData?.length || 0} />
            <ExplosivesTable />
          </section>
        </>
      )}
    </div>
  );
}
