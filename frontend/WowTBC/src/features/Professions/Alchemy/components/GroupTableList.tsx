import { GroupTable } from "./GroupTable";
import type { AlchemyGroup } from "../types";

export interface GroupTableListProps {
  groups: AlchemyGroup[];
  qtys: Record<string, number>;
  setQty: (name: string, q: number) => void;
}

export function GroupTableList({
  groups,
  qtys,
  setQty,
}: GroupTableListProps) {
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <GroupTable 
          key={g.group} 
          group={g} 
          qtys={qtys} 
          setQty={setQty} 
        />
      ))}
    </div>
  );
}
