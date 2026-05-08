import { Wrench } from "lucide-react";
import ProfessionPage from "./ProfessionPage";
export default function Engineering() {
  return <ProfessionPage title="Engineering" description="Gadgets, scopes, and explosives." icon={Wrench}
    items={["Khorium Scope", "Adamantite Scope", "Gnomish Battle Chicken", "Foreman's Reinforced Helmet"]} />;
}
