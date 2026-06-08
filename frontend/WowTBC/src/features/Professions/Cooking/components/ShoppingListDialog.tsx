import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingTable } from "./ShoppingTable";
import type { CookingReagentsByType } from "../types";

interface ShoppingListDialogProps {
  open: boolean;
  qtys: Record<string, number>;
  onOpenChange: (open: boolean) => void;
  reagentList: CookingReagentsByType;
}

export function ShoppingListDialog({
  open,
  onOpenChange,
  reagentList,
  qtys,
}: ShoppingListDialogProps) {
  const [inventory, setInventoryState] = useState<Record<string, number>>({});
  const setInventory = (name: string, v: number) => setInventoryState((p) => ({ ...p, [name]: v }));

  const { totalNeeds, needsByType, mergedTypes } = useMemo(() => {
    const totalNeeds: Record<string, number> = {};
    const needsByType: Record<string, Record<string, number>> = {};
    const mergedTypes: { type: string }[] = [];

    for (const type in reagentList) {
      needsByType[type] = {};
      mergedTypes.push({ type });

      for (const item in reagentList[type]) {
        const itemQty = qtys[item] || 0;
        if (itemQty <= 0) continue;

        for (const reagent of reagentList[type][item]) {
          const requiredQty = reagent.qty * itemQty;

          needsByType[type][reagent.name] = (needsByType[type][reagent.name] || 0) + requiredQty;
          totalNeeds[reagent.name] = (totalNeeds[reagent.name] || 0) + requiredQty;
        }
      }
    }

    return { totalNeeds, needsByType, mergedTypes };
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
            {mergedTypes.map((t) => (
              <TabsTrigger key={t.type} value={t.type} className="flex-1">
                {t.type}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="total" className="mt-4">
            <ShoppingTable needs={totalNeeds} inventory={inventory} setInventory={setInventory} />
          </TabsContent>
          {mergedTypes.map((t) => (
            <TabsContent key={t.type} value={t.type} className="mt-4">
              <ShoppingTable needs={needsByType[t.type]} inventory={inventory} setInventory={setInventory} />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
