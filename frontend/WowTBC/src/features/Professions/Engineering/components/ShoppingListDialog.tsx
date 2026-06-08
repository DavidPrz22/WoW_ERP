import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingTable } from "./ShoppingTable";
import { useEngineeringStore } from "@/ZustandStores/useEngineeringStore";
import type { EngShoppingReagent } from "../types";

interface ShoppingListDialogProps {
  open: boolean;
  qtys: Record<string, number>;
  onOpenChange: (open: boolean) => void;
  reagentList: {
    Parts: Record<string, EngShoppingReagent[]>;
    Explosives: Record<string, EngShoppingReagent[]>;
  } | null;
}

export function ShoppingListDialog({
  open,
  onOpenChange,
  reagentList,
  qtys,
}: ShoppingListDialogProps) {
  const { partsData, explosivesData, buyReagentsToggles } = useEngineeringStore();

  const [inventory, setInventoryState] = useState<Record<string, number>>({});
  const setInventory = (name: string, v: number) => setInventoryState((p) => ({ ...p, [name]: v }));

  const { totalNeeds, needsByGroup, mergedGroups } = useMemo(() => {
    const yieldMap = new Map<string, number>();
    for (const part of partsData || []) {
      yieldMap.set(part.name, part.yield_quantity || 1);
    }
    for (const explosive of explosivesData || []) {
      yieldMap.set(explosive.name, explosive.yield_quantity || 1);
    }

    const partSet = new Set<string>();
    for (const part of partsData || []) {
      partSet.add(part.name);
    }

    const totalNeeds: Record<string, number> = {};
    const needsByGroup: Record<string, Record<string, number>> = {};
    const mergedGroups: { group: string }[] = [];

    if (!reagentList) return { totalNeeds, needsByGroup, mergedGroups };

    const addNeed = (target: Record<string, number>, name: string, qty: number) => {
      target[name] = (target[name] || 0) + qty;
    };

    function resolveReagents(
      itemName: string,
      itemQty: number,
      isExplosive: boolean,
      addToNeeds: (name: string, qty: number) => void
    ) {
      if (itemQty <= 0) return;

      const yieldQty = yieldMap.get(itemName) || 1;
      const craftsNeeded = Math.ceil(itemQty / yieldQty);

      const groupKey = isExplosive ? "Explosives" : "Parts";
      const reagents = reagentList[groupKey as keyof typeof reagentList]?.[itemName];
      if (!reagents) return;

      for (const reagent of reagents) {
        const isToggleOn = isExplosive && !!buyReagentsToggles[itemName];
        const reagentIsPart = partSet.has(reagent.name);

        if (isToggleOn && reagentIsPart) {
          resolveReagents(reagent.name, reagent.qty * craftsNeeded, false, addToNeeds);
        } else {
          addToNeeds(reagent.name, reagent.qty * craftsNeeded);
        }
      }
    }

    for (const groupKey in reagentList) {
      const group = reagentList[groupKey as keyof typeof reagentList];
      needsByGroup[groupKey] = {};
      mergedGroups.push({ group: groupKey });

      const isExplosive = groupKey === "Explosives";

      for (const itemName in group) {
        const itemQty = qtys[itemName] || 0;

        resolveReagents(itemName, itemQty, isExplosive, (name, qty) => {
          addNeed(needsByGroup[groupKey], name, qty);
          addNeed(totalNeeds, name, qty);
        });
      }
    }

    return { totalNeeds, needsByGroup, mergedGroups };
  }, [reagentList, qtys, partsData, explosivesData, buyReagentsToggles]);

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
