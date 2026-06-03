import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function NetherInput({
  label,
  icon: Icon,
  value,
  onChange,
  accent,
}: {
  label: string;
  icon: typeof Sparkles;
  value: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  return (
    <div className="flex items-stretch border border-border/70 bg-card/40 shadow-panel overflow-hidden">
      <div className={cn("flex items-center justify-center w-12", accent)}>
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="flex-1 px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <div className="font-display text-sm text-gold uppercase tracking-[0.2em]">{label}</div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
            Updates every recipe using this reagent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="h-9 w-32 text-right tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
          />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">g</span>
        </div>
      </div>
    </div>
  );
}
