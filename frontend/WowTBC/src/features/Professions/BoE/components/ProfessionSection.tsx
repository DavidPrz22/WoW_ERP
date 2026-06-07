import { useMemo } from "react";
import { BoeTable } from "./BoeTable";
import { SectionHeader } from "@/components/ui/data-table/SectionHeader";
import { CategoryHeader } from "./CategoryHeader";
import type { BoeApiCategory, BoeApiProfession, NetherPrices, Profession } from "../types/types";
import { PROFESSION_COLORS } from "../utils/constants";

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

  const colorClass = PROFESSION_COLORS[profession.profession as Profession] || "bg-muted-foreground";

  return (
    <section className="space-y-4">
      <SectionHeader
        title={profession.profession}
        accent={colorClass}
        count={activeCategories.reduce((sum, cat) => sum + cat.items.length, 0)}
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
