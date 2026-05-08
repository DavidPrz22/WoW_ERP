import { Package } from "lucide-react";
import ProfessionPage from "./ProfessionPage";
export default function Boes() {
  return <ProfessionPage title="BOEs" description="Bind-on-equip world drops and rare gear." icon={Package}
    items={["Hourglass of the Unraveller", "Bloodsea Brigand's Vest", "Boots of the Incorrupt", "Choker of Vile Intent"]} />;
}
