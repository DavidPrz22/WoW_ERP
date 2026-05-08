import { FlaskConical } from "lucide-react";
import ProfessionPage from "@/pages/Professions/ProfessionPage";
export default function Alchemy() {
    return <ProfessionPage title="Alchemy" description="Potions, elixirs, and flasks." icon={FlaskConical}
        items={["Super Mana Potion", "Super Healing Potion", "Flask of Pure Death", "Flask of Relentless Assault", "Elixir of Major Mageblood", "Adept's Elixir"]} />;
}
