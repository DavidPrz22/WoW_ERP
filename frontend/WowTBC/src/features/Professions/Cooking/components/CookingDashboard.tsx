import { UtensilsCrossed } from "lucide-react";
import { PageHeader } from "@/components/ui/data-table/PageHeader";
import { CookingTable } from "./CookingTable";

export function CookingDashboard() {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Cooking"
        description="Buff foods for raids and PvP."
        icon={UtensilsCrossed}
      />
      <CookingTable />
    </div>
  );
}
