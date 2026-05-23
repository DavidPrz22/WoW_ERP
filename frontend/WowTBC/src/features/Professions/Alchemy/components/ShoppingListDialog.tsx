import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingTable } from "./ShoppingTable";
import type { AlchemyGroup } from "../types";

interface ShoppingListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mergedGroups: AlchemyGroup[];
  totalNeeds: Record<string, number>;
  needsByGroup: Record<string, Record<string, number>>;
  inventory: Record<string, number>;
  setInventory: (name: string, v: number) => void;
}

export function ShoppingListDialog({
  open,
  onOpenChange,
  mergedGroups,
  totalNeeds,
  needsByGroup,
  inventory,
  setInventory,
}: ShoppingListDialogProps) {
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
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="total">Total</TabsTrigger>
            <TabsTrigger value="flasks">Flasks</TabsTrigger>
            <TabsTrigger value="elixirs">Elixirs</TabsTrigger>
            <TabsTrigger value="potions">Potions</TabsTrigger>
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
