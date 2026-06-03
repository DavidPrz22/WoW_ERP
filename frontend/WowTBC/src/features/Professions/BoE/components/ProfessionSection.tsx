import { useMemo } from "react";
import { BoeTable } from "./BoeTable";
import { ProfessionHeader } from "./ProfessionHeader";
import { CategoryHeader } from "./CategoryHeader";
import type { BoeItem, Category, Profession, NetherPrices } from "../types/types";
import { CATEGORIES } from "../utils/constants";

export interface ProfessionSectionProps {
  profession: Profession;
  items: BoeItem[];
  netherPrices: NetherPrices;
}

export function ProfessionSection({
  profession,
  items,
  netherPrices,
}: ProfessionSectionProps) {
  const grouped = useMemo(() => {
    const m: Record<Category, BoeItem[]> = { Gear: [], Enhancement: [], Consumable: [], Misc: [] };
    for (const it of items) m[it.category].push(it);
    return m;
  }, [items]);

  const activeCategories = CATEGORIES.filter((c) => grouped[c].length > 0);
  if (activeCategories.length === 0) return null;

  return (
    <section className="space-y-4">
      <ProfessionHeader profession={profession} itemCount={items.length} />

      {activeCategories.map((cat) => (
        <div key={cat} className="space-y-2">
          <CategoryHeader category={cat} />
          <BoeTable items={grouped[cat]} netherPrices={netherPrices} />
        </div>
      ))}
    </section>
  );
}
