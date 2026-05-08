import { useMemo, useState } from "react";
import { items, itemClasses, generateHistory } from "@/data/mock";
import { usePricingHistoryStore } from "@/ZustandStores/usePricingHistoryStore";
import { PricingFilters } from "./PricingFilters";
import { ItemDetailsCard } from "./ItemDetailsCard";
import { PricingChart } from "./PricingChart";

export function PricingHistory() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selected = usePricingHistoryStore((state) => state.selected);
  const cls = usePricingHistoryStore((state) => state.cls);
  const sub = usePricingHistoryStore((state) => state.sub);
  const quality = usePricingHistoryStore((state) => state.quality);
  const subOptions = cls === "all" ? [] : itemClasses[cls] ?? [];

  const suggestions = useMemo(() => {
    const q = query.toLowerCase();
    return items
      .filter((i) => {
        return (
          (cls === "all" || i.itemClass === cls) &&
          (sub === "all" || i.subclass === sub) &&
          (quality === "all" || i.quality === quality) &&
          (!q || i.name.toLowerCase().includes(q))
        );
      })
      .slice(0, 8);
  }, [query, cls, sub, quality]);

  const history = useMemo(() => selected ? generateHistory(selected.id, 30) : [], [selected]);
  const lastRecord = history.length > 0 ? history[history.length - 1] : undefined;
  console.log(history)
  return (
    <div className="px-6 md:px-12 py-10 space-y-6">
      <div>
        <h1 className="font-display text-4xl text-gold">Pricing History</h1>
        <p className="text-muted-foreground text-sm">Explore item prices and market trends across realms.</p>
      </div>

      <PricingFilters
        query={query} setQuery={setQuery}
        open={open} setOpen={setOpen}
        suggestions={suggestions}
        subOptions={subOptions}
      />

      {selected && lastRecord && (
        <div className="grid gap-6 lg:grid-cols-3">
          <ItemDetailsCard selected={selected} lastRecord={lastRecord} />
          <PricingChart history={history} />
        </div>
      )}
    </div>
  );
}
