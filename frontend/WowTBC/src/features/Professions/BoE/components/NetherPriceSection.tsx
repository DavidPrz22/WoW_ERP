import { Sparkles, Wind } from "lucide-react";
import { NetherInput } from "./NetherInput";

export interface NetherPriceSectionProps {
  primalNether: number;
  netherVortex: number;
  onPrimalChange: (val: number) => void;
  onVortexChange: (val: number) => void;
  showPrimal?: boolean;
  showVortex?: boolean;
}

export function NetherPriceSection({
  primalNether,
  netherVortex,
  onPrimalChange,
  onVortexChange,
  showPrimal = true,
  showVortex = true,
}: NetherPriceSectionProps) {
  if (!showPrimal && !showVortex) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-sm text-gold uppercase tracking-[0.2em]">Nether Reagents</h2>
        <div className="h-px flex-1 bg-border/40" />
      </div>
      <div className={`grid gap-4 ${showPrimal && showVortex ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
        {showPrimal && (
          <NetherInput
            label="Primal Nether"
            icon={Sparkles}
            value={primalNether}
            onChange={onPrimalChange}
            accent="bg-[hsl(280_55%_45%)]"
          />
        )}
        {showVortex && (
          <NetherInput
            label="Nether Vortex"
            icon={Wind}
            value={netherVortex}
            onChange={onVortexChange}
            accent="bg-[hsl(214_80%_50%)]"
          />
        )}
      </div>
    </section>
  );
}
