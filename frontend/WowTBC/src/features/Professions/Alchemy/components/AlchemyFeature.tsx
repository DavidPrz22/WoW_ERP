import { useState  } from "react";
import { GroupTableList } from "./GroupTableList";
import { AlchemyHeader } from "./AlchemyHeader";
import { ShoppingListDialog } from "./ShoppingListDialog";
import { AlchemySummaryCards } from "./AlchemySummaryCards";
import type { AlchemyGroup } from "../types";
// import type { AlchemyGroup, Recipe, RowState } from "../types";
// import { AH_CUT } from "../utils/constants";
// import { craftingCost } from "../utils/helpers";
// import { useRecordsStore } from "@/ZustandStores/useRecordsStore";
// import { useRecordData } from "@/features/Records/hooks/queries/useRecords";
import { AlchemyRecordSelects } from "./AlchemyRecordSelects";

export function AlchemyFeature() {
  // const [state, setStateMap] = useState<Record<string, RowState>>(() => {
  //   const init: Record<string, RowState> = {};
  //   for (const g of GROUPS) for (const r of g.recipes) init[r.name] = { ahPrice: r.defaultAHPrice, qty: r.defaultQty };
  //   return init;
  // });
  // const [extraRecipes, setExtraRecipes] = useState<Record<AlchemyGroup["search_group"], Recipe[]>>({
  //   Flasks: [],
  //   Elixirs: [],
  //   Potions: [],
  // });

  // const { dataRealm, dataFaction, dataRecordId } = useRecordsStore();

  // const { data: recordData } = useRecordData({
  //   realm: dataRealm,
  //   faction: dataFaction,
  //   selected_record: dataRecordId,
  // });

  // const customPriceMap = useMemo(() => {
  //   if (!recordData?.groups) return undefined;
  //   const map: Record<string, number> = {};
  //   for (const g of recordData.groups) {
  //     for (const e of g.entries) {
  //       map[e.name] = e.overridenPrice ?? e.price;
  //     }
  //   }
  //   return map;
  // }, [recordData]);
  // const [inventory, setInventoryMap] = useState<Record<string, number>>({});
  // const [openShopping, setOpenShopping] = useState(false);

  // const setRow = (name: string, s: RowState) => setStateMap((p) => ({ ...p, [name]: s }));
  // const setInv = (name: string, v: number) => setInventoryMap((p) => ({ ...p, [name]: v }));

  // const addRecipe = (key: Group["key"], recipe: Recipe) => {
  //   setStateMap((p) => ({ ...p, [recipe.name]: { ahPrice: recipe.defaultAHPrice, qty: recipe.defaultQty } }));
  //   setExtraRecipes((p) => ({ ...p, [key]: [...p[key], recipe] }));
  // };

  // const mergedGroups: AlchemyGroup[] = useMemo(
  //   () => GROUPS.map((g) => ({ ...g, recipes: [...g.recipes, ...extraRecipes[g.key]] })),
  //   [extraRecipes],
  // );

  // const needsByGroup = useMemo(() => {
  //   const map: Record<string, Record<string, number>> = {};
  //   for (const g of mergedGroups) {
  //     const r: Record<string, number> = {};
  //     for (const recipe of g.recipes) {
  //       const qty = state[recipe.name]?.qty ?? 0;
  //       if (qty <= 0) continue;
  //       for (const reagent of recipe.reagents) {
  //         r[reagent.name] = (r[reagent.name] ?? 0) + reagent.qty * qty;
  //       }
  //     }
  //     map[g.key] = r;
  //   }
  //   return map;
  // }, [state, mergedGroups]);

  // const totalNeeds = useMemo(() => {
  //   const r: Record<string, number> = {};
  //   for (const g of mergedGroups) {
  //     for (const [k, v] of Object.entries(needsByGroup[g.key])) {
  //       r[k] = (r[k] ?? 0) + v;
  //     }
  //   }
  //   return r;
  // }, [needsByGroup, mergedGroups]);

  // useEffect(() => {
  //   if (customPriceMap) {
  //     setStateMap((prevState) => {
  //       const newState = { ...prevState };
  //       let updated = false;
  //       for (const g of mergedGroups) {
  //         for (const r of g.recipes) {
  //           if (r.name in customPriceMap) {
  //             const recordPrice = customPriceMap[r.name];
  //             if (prevState[r.name]?.ahPrice !== recordPrice) {
  //               newState[r.name] = {
  //                 ...newState[r.name],
  //                 ahPrice: recordPrice,
  //               };
  //               updated = true;
  //             }
  //           }
  //         }
  //       }
  //       return updated ? newState : prevState;
  //     });
  //   }
  // }, [customPriceMap, mergedGroups]);

  // const grand = useMemo(() => {
  //   let cost = 0;
  //   let profit = 0;
  //   for (const g of mergedGroups) {
  //     for (const r of g.recipes) {
  //       const c = craftingCost(r, customPriceMap);
  //       const s = state[r.name];
  //       if (!s) continue;
  //       cost += c * s.qty;
  //       profit += (s.ahPrice * (1 - AH_CUT) - c) * s.qty;
  //     }
  //   }
  //   return { cost, profit };
  // }, [state, mergedGroups, customPriceMap]);

  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <AlchemyHeader />
        {/* <ShoppingListDialog
          open={openShopping}
          onOpenChange={setOpenShopping}
          mergedGroups={mergedGroups}
          totalNeeds={totalNeeds}
          needsByGroup={needsByGroup}
          inventory={inventory}
          setInventory={setInv}
        /> */}
      </div>

      <AlchemyRecordSelects />

      <AlchemySummaryCards grand={{cost:0, profit:0}} />

      <GroupTableList
        mergedGroups={mergedGroups}
        state={state}
        setRow={setRow}
        addRecipe={addRecipe}
        customPriceMap={customPriceMap}
      />
    </div>
  );
}
