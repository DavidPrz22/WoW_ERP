import { Wrench, Bomb } from "lucide-react";
import { SectionHeader } from "@/components/ui/data-table/SectionHeader";
import { PageHeader } from "@/components/ui/data-table/PageHeader";
import { PartsTable } from "./PartsTable";
import { ExplosivesTable } from "./ExplosivesTable";
import { PARTS, EXPLOSIVES } from "../data";

export function EngineeringDashboard() {
  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Engineering"
        description="Gadgets, scopes, and explosives."
        icon={Wrench}
      />

      <section className="space-y-4">
        <SectionHeader title="Parts" icon={Wrench} accent="bg-[hsl(48_70%_45%)]" count={PARTS.length} />
        <PartsTable />
      </section>

      <section className="space-y-4">
        <SectionHeader title="Explosives" icon={Bomb} accent="bg-[hsl(0_72%_45%)]" count={EXPLOSIVES.length} />
        <ExplosivesTable />
      </section>
    </div>
  );
}
