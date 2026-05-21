import { useMemo, useState, useEffect } from "react";
import { FlaskConical, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupTable } from "./GroupTable";
import { ShoppingTable } from "./ShoppingTable";
import { cn } from "@/lib/utils";
import type { Group, Recipe, RowState } from "../types";
import { GROUPS, AH_CUT } from "../utils/constants";
import { craftingCost, fmt } from "../utils/helpers";
import { useRecordsStore } from "@/ZustandStores/useRecordsStore";
import { useRecordData } from "@/features/Records/hooks/queries/useRecords";
import { AlchemyRecordSelects } from "./AlchemyRecordSelects";

export function AlchemyFeature() {
  const [state, setStateMap] = useState<Record<string, RowState>>(() => {
    const init: Record<string, RowState> = {};
    for (const g of GROUPS) for (const r of g.recipes) init[r.name] = { ahPrice: r.defaultAHPrice, qty: r.defaultQty };
    return init;
  });
  const [extraRecipes, setExtraRecipes] = useState<Record<Group["key"], Recipe[]>>({
    Flasks: [],
    Elixirs: [],
    Potions: [],
  });

  const { dataRealm, dataFaction, dataRecordId } = useRecordsStore();

  const { data: recordData } = useRecordData({
    realm: dataRealm,
    faction: dataFaction,
    selected_record: dataRecordId,
  });

  const customPriceMap = useMemo(() => {
    if (!recordData?.groups) return undefined;
    const map: Record<string, number> = {};
    for (const g of recordData.groups) {
      for (const e of g.entries) {
        map[e.name] = e.overridenPrice ?? e.price;
      }
    }
    return map;
  }, [recordData]);
  const [inventory, setInventoryMap] = useState<Record<string, number>>({});
  const [openShopping, setOpenShopping] = useState(false);

  const setRow = (name: string, s: RowState) => setStateMap((p) => ({ ...p, [name]: s }));
  const setInv = (name: string, v: number) => setInventoryMap((p) => ({ ...p, [name]: v }));

  const addRecipe = (key: Group["key"], recipe: Recipe) => {
    setStateMap((p) => ({ ...p, [recipe.name]: { ahPrice: recipe.defaultAHPrice, qty: recipe.defaultQty } }));
    setExtraRecipes((p) => ({ ...p, [key]: [...p[key], recipe] }));
  };

  const mergedGroups: Group[] = useMemo(
    () => GROUPS.map((g) => ({ ...g, recipes: [...g.recipes, ...extraRecipes[g.key]] })),
    [extraRecipes],
  );

  const needsByGroup = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const g of mergedGroups) {
      const r: Record<string, number> = {};
      for (const recipe of g.recipes) {
        const qty = state[recipe.name]?.qty ?? 0;
        if (qty <= 0) continue;
        for (const reagent of recipe.reagents) {
          r[reagent.name] = (r[reagent.name] ?? 0) + reagent.qty * qty;
        }
      }
      map[g.key] = r;
    }
    return map;
  }, [state, mergedGroups]);

  const totalNeeds = useMemo(() => {
    const r: Record<string, number> = {};
    for (const g of mergedGroups) {
      for (const [k, v] of Object.entries(needsByGroup[g.key])) {
        r[k] = (r[k] ?? 0) + v;
      }
    }
    return r;
  }, [needsByGroup, mergedGroups]);

  useEffect(() => {
    if (customPriceMap) {
      setStateMap((prevState) => {
        const newState = { ...prevState };
        let updated = false;
        for (const g of mergedGroups) {
          for (const r of g.recipes) {
            if (r.name in customPriceMap) {
              const recordPrice = customPriceMap[r.name];
              if (prevState[r.name]?.ahPrice !== recordPrice) {
                newState[r.name] = {
                  ...newState[r.name],
                  ahPrice: recordPrice,
                };
                updated = true;
              }
            }
          }
        }
        return updated ? newState : prevState;
      });
    }
  }, [customPriceMap, mergedGroups]);

  const grand = useMemo(() => {
    let cost = 0;
    let profit = 0;
    for (const g of mergedGroups) {
      for (const r of g.recipes) {
        const c = craftingCost(r, customPriceMap);
        const s = state[r.name];
        if (!s) continue;
        cost += c * s.qty;
        profit += (s.ahPrice * (1 - AH_CUT) - c) * s.qty;
      }
    }
    return { cost, profit };
  }, [state, mergedGroups, customPriceMap]);

  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-md bg-gradient-gold shadow-gold flex items-center justify-center text-primary-foreground">
            <FlaskConical className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-4xl text-gold">Alchemy</h1>
            <p className="text-muted-foreground text-sm">Cost, margin & profit calculator for Flasks, Elixirs & Potions.</p>
          </div>
        </div>
        <Dialog open={openShopping} onOpenChange={setOpenShopping}>
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
                <ShoppingTable needs={totalNeeds} inventory={inventory} setInventory={setInv} />
              </TabsContent>
              {mergedGroups.map((g) => (
                <TabsContent key={g.key} value={g.key} className="mt-4">
                  <ShoppingTable needs={needsByGroup[g.key]} inventory={inventory} setInventory={setInv} />
                </TabsContent>
              ))}
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <AlchemyRecordSelects />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-border/70 bg-card/40 px-5 py-4 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Cost</span>
          <span className="font-display text-2xl text-gold tabular-nums">{fmt(grand.cost)}</span>
        </div>
        <div className="border border-border/70 bg-card/40 px-5 py-4 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Profit</span>
          <span
            className={cn(
              "font-display text-2xl tabular-nums",
              grand.profit >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive",
            )}
          >
            {fmt(grand.profit)}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {mergedGroups.map((g) => (
          <GroupTable 
            key={g.key} 
            group={g} 
            state={state} 
            setState={setRow} 
            onAddRecipe={addRecipe} 
            customPriceMap={customPriceMap}
            />
        ))}
      </div>
    </div>
  );
}
