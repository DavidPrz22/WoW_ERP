import { UtensilsCrossed } from "lucide-react";
import ProfessionPage from "./ProfessionPage";
export default function Cooking() {
  return <ProfessionPage title="Cooking" description="Buff foods for raids and PvP." icon={UtensilsCrossed}
    items={["Spicy Crawdad", "Golden Fish Sticks", "Crunchy Serpent", "Blackened Sporefish", "Grilled Mudfish"]} />;
}
