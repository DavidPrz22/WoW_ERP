import { useState, useMemo, useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import { PageHeader } from "@/components/ui/data-table/PageHeader";
import { CookingTable } from "./CookingTable";
import { CookingRecordSelects } from "./CookingRecordSelects";
import { CookingSummaryCards } from "./CookingSummaryCards";
import { ShoppingListDialog } from "./ShoppingListDialog";
import { useCookingGroupData } from "../hooks/queries/queries";
import { useCookingStore } from "@/ZustandStores/useCookingStore";
import { calculateGrandTotals } from "../helpers/helpers";

export function CookingDashboard() {
  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const { dataRealm, dataFaction, dataRecordId, cookingGroupsData, setCookingGroupsData, quantities } = useCookingStore();

  const { data: recordData } = useCookingGroupData({
    realm: dataRealm,
    faction: dataFaction,
    selected_record: dataRecordId,
  });

  useEffect(() => {
    if (!recordData?.groups_data) return;
    setCookingGroupsData(recordData.groups_data);
  }, [recordData, setCookingGroupsData]);

  const reagentList = useMemo(() => {
    if (!recordData?.total_reagents_used) return {};
    return recordData.total_reagents_used;
  }, [recordData]);

  const grand = useMemo(() => {
    if (!cookingGroupsData) return { cost: 0, profit: 0 };
    return calculateGrandTotals(cookingGroupsData, quantities);
  }, [quantities, cookingGroupsData]);

  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PageHeader
          title="Cooking"
          description="Buff foods for raids and PvP."
          icon={UtensilsCrossed}
        />
        <ShoppingListDialog
          open={shoppingListOpen}
          onOpenChange={setShoppingListOpen}
          reagentList={reagentList}
          qtys={quantities}
        />
      </div>
      <CookingRecordSelects />
      <CookingSummaryCards grand={grand} />
      <CookingTable />
    </div>
  );
}
