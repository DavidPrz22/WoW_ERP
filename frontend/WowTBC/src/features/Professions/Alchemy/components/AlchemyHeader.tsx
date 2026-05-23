import { FlaskConical } from "lucide-react";

export function AlchemyHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-md bg-gradient-gold shadow-gold flex items-center justify-center text-primary-foreground">
        <FlaskConical className="h-7 w-7" />
      </div>
      <div>
        <h1 className="font-display text-4xl text-gold">Alchemy</h1>
        <p className="text-muted-foreground text-sm">Cost, margin & profit calculator for Flasks, Elixirs & Potions.</p>
      </div>
    </div>
  );
}
