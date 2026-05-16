import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion } from "@/components/ui/accordion";
import { toast } from "sonner";
import { formatGold } from "@/data/mock";
import { PriceGroupSection } from "./SystemPriceGroup";
import { useRecordsStore } from "@/ZustandStores/useRecordsStore";
import { RecordSelects } from "./RecordSelects";
import { useRecordData } from "../hooks/useRecords";

export type PriceGroup = {
  title: string;
  entries: { name: string; price: number; icon?: string; recordId?: string; itemId?: string; overridenPrice?: number }[];
};

// type Override = { value: number; previous: number };

export function PriceTablePanel() {
  const { 
    priceQuery, 
    showGold, 
    overrides, 
    dataRealm,
    dataFaction,
    dataRecordId,
    setPriceQuery, 
    setShowGold, 
    setOverride, 
    removeOverride 
  } = useRecordsStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const { data } = useRecordData({
    realm: dataRealm,
    faction: dataFaction,
    selected_record: dataRecordId,
  });

  const priceGroups: PriceGroup[] = useMemo(() => data?.groups || [], [data]);

  // Load existing overrides from the backend data
  useEffect(() => {
    if (priceGroups.length > 0) {
      priceGroups.forEach(group => {
        group.entries.forEach(entry => {
          if (entry.overridenPrice && !overrides[entry.name]) {
            setOverride(entry.name, entry.overridenPrice, entry.price);
          }
        });
      });
    }
  }, [priceGroups]);

  const totalItems = useMemo(
    () => priceGroups.reduce((sum, g) => sum + g.entries.length, 0),
    [priceGroups]
  );

  const filteredGroups = useMemo(() => {
    const q = priceQuery.trim().toLowerCase();
    if (!q) return priceGroups;
    return priceGroups
      .map((g) => ({ ...g, entries: g.entries.filter((e) => e.name.toLowerCase().includes(q)) }))
      .filter((g) => g.entries.length > 0);
  }, [priceQuery, priceGroups]);

  const startEdit = (key: string, current: number) => {
    setEditing(key);
    setDraft(String(current));
  };

  const commit = (key: string, original: number) => {
    const v = parseFloat(draft);
    if (!isNaN(v) && v >= 0) {
      setOverride(key, v, original);
      toast.success("Price overwritten", { description: `${key} → ${v.toFixed(4)}g` });
    }
    setEditing(null);
  };

  const reset = (key: string) => {
    removeOverride(key);
  };

  const formatPrice = (gold: number) =>
    showGold ? formatGold(Math.round(gold)) : `${gold/10000}g`;

  return (
    <div className="mt-6 space-y-4">
      <div className="mb-6">
        <RecordSelects />
      </div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-muted-foreground">
          {totalItems} items · {Object.keys(overrides).length} overridden
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
            overrides={overrides}
            editing={editing}
            draft={draft}
            setDraft={setDraft}
            startEdit={startEdit}
            commit={commit}
            reset={reset}
            cancel={() => setEditing(null)}
            formatPrice={formatPrice}
          />
        ))}
      </Accordion>
    </div>
  );
}