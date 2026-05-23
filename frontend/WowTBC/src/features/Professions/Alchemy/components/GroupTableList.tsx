import { GroupTable } from "./GroupTable";
import type { Group, Recipe, RowState } from "../types";

export interface GroupTableListProps {
  mergedGroups: Group[];
  state: Record<string, RowState>;
  setRow: (name: string, s: RowState) => void;
  addRecipe: (key: Group["key"], recipe: Recipe) => void;
  customPriceMap?: Record<string, number>;
}

export function GroupTableList({
  mergedGroups,
  state,
  setRow,
  addRecipe,
  customPriceMap,
}: GroupTableListProps) {
  return (
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
  );
}
