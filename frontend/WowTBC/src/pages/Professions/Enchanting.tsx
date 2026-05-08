import { Sparkles } from "lucide-react";
import ProfessionPage from "./ProfessionPage";
export default function Enchanting() {
  return <ProfessionPage title="Enchanting" description="Enchants and disenchanting materials." icon={Sparkles}
    items={["Large Prismatic Shard", "Void Crystal", "Arcane Dust", "Greater Planar Essence", "Nexus Crystal"]} />;
}
