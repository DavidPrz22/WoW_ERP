import { useState, useMemo } from "react";
import { GroupTableList } from "./GroupTableList";
import { AlchemyHeader } from "./AlchemyHeader";
import { AlchemySummaryCards } from "./AlchemySummaryCards";
import { useAlchemyGroupData } from "../hooks/queries/queries";
import { useAlchemyStore } from "@/ZustandStores/useAlchemyStore";
import { AlchemyRecordSelects } from "./AlchemyRecordSelects";
import type { AlchemyRecord } from "../types";
import { ShoppingListDialog } from "./ShoppingListDialog";

export function AlchemyFeature() {
  const [qtys, setQtys] = useState<AlchemyRecord>({});
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const { dataRealm, dataFaction, dataRecordId } = useAlchemyStore();

  const { data: recordData } = useAlchemyGroupData({
    realm: dataRealm,
    faction: dataFaction,
    selected_record: dataRecordId,
  });

  const mergedGroups = useMemo(() => {
    if (!recordData?.groups_data) return [];
    return recordData.groups_data;
  }, [recordData]);

  const reagentList = useMemo(() => {
    if (!recordData?.total_reagents_used) return {};
    return recordData.total_reagents_used;
  }, [recordData]);

    
  const setQty = (name: string, v: number) => setQtys((p) => ({ ...p, [name]: v }));

  const grand = useMemo(() => {
    let cost = 0;
    let profit = 0;
    for (const g of mergedGroups) {
      for (const item of g.items) {
        const qty = qtys[item.name] ?? 0;
        cost += item.craftingCost * qty;
        profit += item.profitPerItem * qty;
      }
    }
    return { cost, profit };
  }, [qtys, mergedGroups]);
  

  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <AlchemyHeader />
        <ShoppingListDialog 
          open={shoppingListOpen} 
          onOpenChange={setShoppingListOpen} 
          reagentList={reagentList}
          qtys={qtys}
          />
      </div>

      <AlchemyRecordSelects />

      <AlchemySummaryCards grand={grand} />

      <GroupTableList
        groups={mergedGroups}
        qtys={qtys}
        setQty={setQty}
      />
      
    </div>
  );
}
