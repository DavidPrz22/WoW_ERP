import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingTable } from "./ShoppingTable";
import type { AlchemyRecord, ReagentListbyGroup } from "../types";

interface ShoppingListDialogProps {
  open: boolean;
  qtys: AlchemyRecord;
  onOpenChange: (open: boolean) => void;
  reagentList: ReagentListbyGroup;
}

export function ShoppingListDialog({
  open,
  onOpenChange,
  reagentList,
  qtys,
}: ShoppingListDialogProps) {

  const [inventory, setInventoryState] = useState<Record<string, number>>({});
  const setInventory = (name: string, v: number) => setInventoryState((p) => ({ ...p, [name]: v }));

  const { totalNeeds, needsByGroup, mergedGroups } = useMemo(() => {
    const totalNeeds: Record<string, number> = {};
    const needsByGroup: Record<string, Record<string, number>> = {};
    const mergedGroups: { group: string }[] = [];

    for (const group in reagentList) {
      needsByGroup[group] = {};
      mergedGroups.push({ group });

      for (const item in reagentList[group]) {
        const itemQty = qtys[item] || 0;
        if (itemQty <= 0) continue;

        for (const reagent of reagentList[group][item]) {
          const requiredQty = reagent.qty * itemQty;
          
          needsByGroup[group][reagent.name] = (needsByGroup[group][reagent.name] || 0) + requiredQty;
          totalNeeds[reagent.name] = (totalNeeds[reagent.name] || 0) + requiredQty;
        }
      }
    }

    return { totalNeeds, needsByGroup, mergedGroups };
  }, [reagentList, qtys]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Shopping List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-gold">Shopping List</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="total" className="w-full">
          <TabsList className="flex w-full overflow-x-auto">
            <TabsTrigger value="total" className="flex-1">Total</TabsTrigger>
            {mergedGroups.map((g) => (
              <TabsTrigger key={g.group} value={g.group} className="flex-1">
                {g.group}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="total" className="mt-4">
            <ShoppingTable needs={totalNeeds} inventory={inventory} setInventory={setInventory} />
          </TabsContent>
          {mergedGroups.map((g) => (
            <TabsContent key={g.group} value={g.group} className="mt-4">
              <ShoppingTable needs={needsByGroup[g.group]} inventory={inventory} setInventory={setInventory} />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
