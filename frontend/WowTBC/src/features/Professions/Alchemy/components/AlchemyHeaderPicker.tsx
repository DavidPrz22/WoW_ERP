import { useState } from "react";
import {History } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { fmt } from "../utils/helpers";
import { cn } from "@/lib/utils";
import { useQueryClient } from '@tanstack/react-query';
import { ALCHEMY_GROUP_DATA } from "../hooks/queries/queryOptions";
import { useAlchemyStore } from "@/ZustandStores/useAlchemyStore";
import type { AlchemyCalculationsResponse } from "../types";
import { useToast  } from "@/hooks/use-toast";

const labelMap: Record<string, string> = {
    craftingCost: "Crafting Cost",
    AHPrice: "AH Price",
  };

export function HeaderPickerDialog({
  column,
  group,
  className,
}: {
  column: string;
  group: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { toast } = useToast();

  const { 
    dataRealm, 
    dataFaction, 
    dataRecordId, 
    alchemyGroupsData, 
    setAlchemyGroupsData 
  } = useAlchemyStore()
  ;
  const queryClient = useQueryClient();
  
  const cachedRecordsRaw = queryClient.getQueriesData({
    queryKey: [ALCHEMY_GROUP_DATA]
  });

  const availableRecords = Array.from(
    new Map(
      cachedRecordsRaw
        .map(([queryKey]) => {
          const params = queryKey[1] as { realm?: string; faction?: string; record?: string };
          if (params?.record) {
            return [
              params.record,
              {
                id: params.record,
                realm: params.realm || "Unknown",
                faction: params.faction || "Unknown",
              },
            ] as const;
          }
          return null;
        })
        .filter((item): item is [string, { id: string; realm: string; faction: string }] => item !== null)
    ).values()
  );

  const handleUpdateData = (group: string, column: string, recordId: string) => {
  // 1. Retrieve cache data
  const data: AlchemyCalculationsResponse | undefined = queryClient.getQueryData([
    ALCHEMY_GROUP_DATA, 
    { realm: dataRealm, faction: dataFaction, record: recordId }
  ]);

  const sourceItems = data?.groups_data.find((g) => g.group === group)?.items || [];
  
  const columnValueMap = new Map<string, number>(
    sourceItems.map((item) => [item.name, item[column as keyof typeof item] as number])
  );
  const updatedGroupsData = (alchemyGroupsData || []).map((groupData) => {
    if (groupData.group !== group) {
      return groupData;
    }

    return {
      ...groupData,
      items: groupData.items.map((item) => {
        if (columnValueMap.has(item.name)) {
          return {
            ...item,
            [column]: columnValueMap.get(item.name),
          };
        }
        return item;
      }),
    };
  });

  setAlchemyGroupsData(updatedGroupsData);
  toast({ 
    title: "Data Updated", 
    description: `Updated ${labelMap[column] || column} for ${group} from selected record!`, 
    duration: 3000,
  });
  };
  const displayName = labelMap[column] || column;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/header inline-flex w-full items-center gap-1.5 uppercase tracking-wider text-xs text-muted-foreground transition-colors hover:text-gold focus-visible:text-gold focus-visible:outline-none",
            className,
          )}
        >
          <History className="h-3 w-3 opacity-0 transition-opacity group-hover/header:opacity-70" />
          <span>{displayName}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-border/70 bg-card/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="font-display text-gold uppercase tracking-[0.18em] text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            {displayName} · Records
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-2">
          Select a record to populate <span className="text-gold">{displayName}</span> for every row.
        </p>
        <div className="border border-border/70 bg-background/60 divide-y divide-border/50 max-h-[360px] overflow-auto">
          {availableRecords.map((rec) => (
            <button
              key={rec.id}
              type="button"
              onClick={() => {
                handleUpdateData(group, column, rec.id);
                setIsOpen(false);
              }}
              className={`w-full grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50 focus-visible:bg-secondary/60 focus-visible:outline-none group ${dataRecordId === rec.id ? "bg-secondary/70" : ""}`}
            >
              <div className="min-w-0">
                <div className="text-xs font-mono text-muted-foreground tracking-wide">{rec.id}</div>
                <div className="text-sm text-gold truncate group-hover:text-primary transition-colors">
                  {rec.realm} - {rec.faction}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}