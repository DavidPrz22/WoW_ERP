import { useMemo } from "react";
import { BoeTable } from "./BoeTable";
import { ProfessionHeader } from "./ProfessionHeader";
import { CategoryHeader } from "./CategoryHeader";
import type { BoeApiCategory, BoeApiProfession, NetherPrices } from "../types/types";

export interface ProfessionSectionProps {
  profession: BoeApiProfession;
  netherPrices: NetherPrices;
}

export function ProfessionSection({
  profession,
  netherPrices,
}: ProfessionSectionProps) {
  const activeCategories = useMemo(() => {
    return profession.items.filter((cat: BoeApiCategory) => cat.items.length > 0);
  }, [profession.items]);

  if (activeCategories.length === 0) return null;

  return (
    <section className="space-y-4">
      <ProfessionHeader
        profession={profession.profession}
        itemCount={activeCategories.reduce((sum, cat) => sum + cat.items.length, 0)}
      />

      {activeCategories.map((cat: BoeApiCategory) => (
        <div key={cat.category} className="space-y-2">
          <CategoryHeader category={cat.category} />
          <BoeTable items={cat.items} netherPrices={netherPrices} />
        </div>
      ))}
    </section>
  );
}
