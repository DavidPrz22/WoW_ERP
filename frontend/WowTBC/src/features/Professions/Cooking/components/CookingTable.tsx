import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCookingStore } from "@/ZustandStores/useCookingStore";
import { WowCurrency } from "./WowCurrency";
import {
  calculateBreakeven,
  calculateProfitPerItem,
  calculateROI,
  calculateExpectedProfit,
} from "../helpers/helpers";
import type { CookingType } from "../types";

const TYPE_META: Record<CookingType, { label: string; dot: string }> = {
  "Agility": { label: "Agility", dot: "bg-[hsl(142_55%_50%)]" },
  "Spell power": { label: "Spell Power", dot: "bg-[hsl(214_80%_55%)]" },
  "Stamina": { label: "Stamina", dot: "bg-[hsl(0_72%_45%)]" },
  "Strength": { label: "Strength", dot: "bg-[hsl(24_60%_45%)]" },
  "Healing": { label: "Healing", dot: "bg-[hsl(48_70%_50%)]" },
  "Hit Rating": { label: "Hit Rating", dot: "bg-[hsl(280_55%_60%)]" },
  "Pet Buff": { label: "Pet", dot: "bg-[hsl(180_55%_45%)]" },
  "Other": { label: "Other", dot: "bg-[hsl(0_0%_60%)]" },
};

const TYPE_ORDER: CookingType[] = [
  "Agility",
  "Spell power",
  "Stamina",
  "Strength",
  "Healing",
  "Hit Rating",
  "Pet Buff",
  "Other",
];

export function CookingTable() {
  const { cookingGroupsData, quantities, setQuantities } = useCookingStore();

  const orderedGroups = useMemo(() => {
    if (!cookingGroupsData) return [];
    const map = new Map(cookingGroupsData.map((g) => [g.type, g]));
    return TYPE_ORDER.map((type) => map.get(type)).filter(Boolean);
  }, [cookingGroupsData]);

  const handleSetQty = (name: string, q: number) => {
    setQuantities({ ...quantities, [name]: q });
  };

  if (!cookingGroupsData) {
    return (
      <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm p-8 text-center">
        <p className="text-muted-foreground">Select faction, realm, and record to load cooking data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orderedGroups.map((group) => {
        const meta = TYPE_META[group.type];

        const rows = group.items.map((item) => {
          const qty = quantities[item.name] ?? 0;
          const profitPerItem = calculateProfitPerItem(item.AHPrice, item.craftingCost);
          const breakeven = calculateBreakeven(item.craftingCost);
          const roi = calculateROI(profitPerItem, item.craftingCost);
          const expected = calculateExpectedProfit(profitPerItem, qty);

          return { item, qty, profitPerItem, breakeven, roi, expected };
        });

        return (
          <section key={group.type} className="space-y-3">
            <h2 className="font-display text-lg text-gold uppercase tracking-[0.2em] border-l-4 border-primary pl-4">
              {meta.label}
            </h2>
            <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-secondary/40 border-b border-border/70 hover:bg-secondary/40">
                    <TableHead className="h-10 uppercase tracking-wider text-xs">Item</TableHead>
                    <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
                    <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven</TableHead>
                    <TableHead className="h-10 text-center uppercase tracking-wider text-xs">AH Price</TableHead>
                    <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit / Item</TableHead>
                    <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
                    <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">Qty to Make</TableHead>
                    <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Expected Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(({ item, qty, profitPerItem, breakeven, roi, expected }) => {
                    const noAh = item.AHPrice <= 0;
                    const positive = profitPerItem >= 0;
                    return (
                      <TableRow key={item.name} className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
                        <TableCell className="py-2 font-medium text-gold">{item.name}</TableCell>
                        <TableCell className="py-2 text-right"><WowCurrency value={item.craftingCost} /></TableCell>
                        <TableCell className="py-2 text-right text-muted-foreground"><WowCurrency value={breakeven} /></TableCell>
                        <TableCell className="py-2 text-center text-gold">
                          {noAh ? "—" : <WowCurrency value={item.AHPrice} />}
                        </TableCell>
                        <TableCell className={cn("py-2 text-right font-medium", noAh ? "text-muted-foreground/60" : positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                          {noAh ? "—" : <WowCurrency value={profitPerItem} isProfit={true} />}
                        </TableCell>
                        <TableCell className={cn("py-2 text-right tabular-nums font-mono", noAh ? "text-muted-foreground/60" : roi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                          {noAh ? "—" : `${roi.toFixed(2)}%`}
                        </TableCell>
                        <TableCell className="py-2 text-center">
                          <Input
                            type="number"
                            min={0}
                            value={qty || ""}
                            onChange={(e) => handleSetQty(item.name, parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="h-8 w-24 mx-auto text-right tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                          />
                        </TableCell>
                        <TableCell className={cn("py-2 text-right font-medium", noAh || qty === 0 ? "text-muted-foreground/60" : expected >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                          {noAh || qty === 0 ? "—" : <WowCurrency value={expected} isProfit={true} />}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
