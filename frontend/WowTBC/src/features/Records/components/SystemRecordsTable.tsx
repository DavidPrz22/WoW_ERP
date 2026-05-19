import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion } from "@/components/ui/accordion";
import { toast } from "sonner";
import { PriceGroupSection } from "./SystemPriceGroup";
import { formatPrice, getMarketValuePercentStyles } from "../utils/utils";
import { useRecordsStore } from "@/ZustandStores/useRecordsStore";
import { RecordSelects } from "./RecordSelects";
import { useRecordData } from "../hooks/useRecords";
import { useOverridePriceMutation } from "../hooks/mutations/useMutationRecords";
import type { PriceEntry } from "../types";
import { useUserDataRecordDetails } from "@/hooks/useQueryHooks";
import { useRecordsSelect } from "../hooks/useRecords";
// type Override = { value: number; previous: number };

export function PriceTablePanel() {
  const { 
    priceQuery, 
    showGold, 
    dataRealm,
    dataFaction,
    dataRecordId,
    setPriceQuery, 
    setShowGold,
    setDataRecordId
  } = useRecordsStore();

  const [editing, setEditing] = useState<string | null>(null);

  const { data: { groups = [] } = { groups: [] } } = useRecordData({
    realm: dataRealm,
    faction: dataFaction,
    selected_record: dataRecordId,
  });

  const { data: userDataRecordDetails } = useUserDataRecordDetails();
  const { data: recordsSelectData } = useRecordsSelect({
    realm: dataRealm,
    faction: dataFaction,
  });

  useEffect(() => {
    if (userDataRecordDetails) {
      
      const { recordDetails } = userDataRecordDetails;
      const recordId = recordDetails.recordId;
      
      const matchingRecord = recordsSelectData?.results.find(r => r.id === recordId);

      if (matchingRecord) {
          setDataRecordId(recordId.toString());
      }
    }
  }, [userDataRecordDetails, setDataRecordId, recordsSelectData]);

  const priceGroups = useMemo(() => {
    if (!groups) return [];
    return groups.map((g) => ({
      ...g,
      entries: [...g.entries].sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [groups]);

  const totalItems = useMemo(
    () => priceGroups.reduce((sum, g) => sum + g.entries.length, 0),
    [priceGroups]
  );

  const filteredGroups = useMemo(() => {
    const q = priceQuery.trim().toLowerCase();
    if (!q) return priceGroups;
    return priceGroups
      .map((g) => ({ ...g, entries: g.entries.filter((e: PriceEntry) => e.name.toLowerCase().includes(q)) }))
      .filter((g) => g.entries.length > 0);
  }, [priceQuery, priceGroups]);

  
  const startEdit = (key: string) => {
    setEditing(key);
  };

  const reset = async (entry: PriceEntry, key: string) => {
    if (!entry.recordId || !entry.itemId) {
      toast.error('Missing record or item data');
      return;
    }

    await overridePriceMutation({
      recordId: entry.recordId.toString(),
      itemId: entry.itemId.toString(),
      newPrice: null
    });
    toast.success(`Price override for ${key} has been removed`);
  };

  const { mutateAsync: overridePriceMutation } = useOverridePriceMutation();

  const commit = async (key: string, entry: PriceEntry, newPrice: number) => {
    const prevPrice = entry.overridenPrice ?? entry.price;
    if (newPrice === prevPrice) {
      setEditing(null);
      return;
    }

    if (!entry.recordId || !entry.itemId) {
      toast.error('Missing record or item data');
      setEditing(null);
      return;
    }

    await overridePriceMutation({
        recordId: entry.recordId.toString(),
        itemId: entry.itemId.toString(),
        newPrice: newPrice
      });
    toast.success(`Price for ${key} updated to ${formatPrice(newPrice, showGold)}`);
    setEditing(null);
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="mb-6">
        <RecordSelects />
      </div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-muted-foreground">
          {totalItems} items
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="gold-fmt" className="text-xs text-muted-foreground">Gold format</Label>
          <Switch id="gold-fmt" checked={showGold} onCheckedChange={setShowGold} />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={priceQuery}
          onChange={(e) => setPriceQuery(e.target.value)}
          placeholder="Search reagent…"
          className="pl-9 bg-secondary/40"
        />
      </div>

      <Accordion type="multiple" defaultValue={priceGroups.map((g) => g.title)} className="space-y-2">
        {filteredGroups.map((group) => (
          <PriceGroupSection
            key={group.title}
            group={group}
            editing={editing}
            startEdit={startEdit}
            commit={commit}
            reset={reset}
            cancel={() => setEditing(null)}
            formatPrice={(gold) => formatPrice(gold, showGold)}
            getMarketValuePercentStyles={getMarketValuePercentStyles}
          />
        ))}
      </Accordion>
    </div>
  );
}