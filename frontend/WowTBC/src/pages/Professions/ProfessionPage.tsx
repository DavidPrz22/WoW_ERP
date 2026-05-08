import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface Props {
    title: string;
    description: string;
    icon: LucideIcon;
    items?: string[];
}

export default function ProfessionPage({ title, description, icon: Icon, items = [] }: Props) {
  return (
    <div className="px-6 md:px-12 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-md bg-gradient-gold shadow-gold flex items-center justify-center text-primary-foreground">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-display text-4xl text-gold">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <Card key={it} className="bg-card/60 border-border shadow-panel hover:border-primary/40 transition-colors">
            <CardContent className="p-5">
              <div className="font-medium">{it}</div>
              <div className="text-xs text-muted-foreground mt-1">Coming soon — pricing & recipes</div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <Card className="bg-card/60 border-border col-span-full">
            <CardContent className="p-10 text-center text-muted-foreground">
              Browse view coming soon.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}