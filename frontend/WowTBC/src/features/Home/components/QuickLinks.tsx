import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Database, LineChart, FlaskConical, Gem, Wrench, UtensilsCrossed, Package, ArrowRight } from "lucide-react";

const links = [
  { icon: Database, label: "Records", description: "View ingestion snapshots", route: "/records" },
  { icon: LineChart, label: "Pricing History", description: "Track market trends", route: "/pricing" },
  { icon: FlaskConical, label: "Alchemy", description: "Potion & elixir margins", route: "/professions/alchemy" },
  { icon: Gem, label: "Jewelcrafting", description: "Prospect & cut gems", route: "/professions/jewelcrafting" },
  { icon: Wrench, label: "Engineering", description: "Parts & explosives", route: "/professions/engineering" },
  { icon: UtensilsCrossed, label: "Cooking", description: "Food recipes & costs", route: "/professions/cooking" },
  { icon: Package, label: "BoE's", description: "Bind on Equip items", route: "/professions/BOE" },
];

export function QuickLinks() {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {links.map((link) => (
        <Card key={link.label} className="bg-card/40 border-border/70 hover:border-primary/50 transition-colors">
          <CardContent className="p-4">
            <Link to={link.route} className="flex flex-col gap-2 group">
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-md bg-secondary flex items-center justify-center text-gold">
                  <link.icon className="h-4 w-4" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </div>
              <div>
                <div className="text-sm font-medium">{link.label}</div>
                <div className="text-xs text-muted-foreground">{link.description}</div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
