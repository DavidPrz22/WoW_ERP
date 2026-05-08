import { Gem } from "lucide-react";
import ProfessionPage from "./ProfessionPage";
export default function Gemcutting() {
  return <ProfessionPage title="Gemcutting" description="Jewelcrafting cuts for raw gems." icon={Gem}
    items={["Living Ruby", "Dawnstone", "Star of Elune", "Talasite", "Noble Topaz", "Nightseye"]} />;
}
