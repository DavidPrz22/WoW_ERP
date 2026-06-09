import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Gem, Wrench, UtensilsCrossed, Package } from "lucide-react";
import { ArrowRight } from "lucide-react";

const professions = [
  {
    icon: FlaskConical,
    name: "Alchemy",
    description: "Potions, elixirs, and transmutes",
    route: "/professions/alchemy",
  },
  {
    icon: Gem,
    name: "Jewelcrafting",
    description: "Prospecting ore and cutting gems",
    route: "/professions/jewelcrafting",
  },
  {
    icon: Wrench,
    name: "Engineering",
    description: "Parts, explosives, and gadgets",
    route: "/professions/engineering",
  },
  {
    icon: UtensilsCrossed,
    name: "Cooking",
    description: "Feasts and stat food",
    route: "/professions/cooking",
  },
  {
    icon: Package,
    name: "BoE's",
    description: "Bind on Equip crafted gear",
    route: "/professions/BOE",
  },
];

export function ProfessionCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {professions.map((prof) => (
        <Card key={prof.name} className="bg-card/40 border-border/70 hover:border-primary/50 transition-colors">
          <CardContent className="p-4">
            <Link to={prof.route} className="flex flex-col gap-3 group">
              <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center text-gold">
                <prof.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{prof.name}</div>
                  <div className="text-xs text-muted-foreground">{prof.description}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}