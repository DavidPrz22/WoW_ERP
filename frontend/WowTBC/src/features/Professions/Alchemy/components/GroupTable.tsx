import { useMemo, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ItemCombobox } from "./ItemCombobox";
import { cn } from "@/lib/utils";
import type { AlchemyGroup, Recipe, RowState, DraftRow } from "../types";
import { AH_CUT, priceMap } from "../utils/constants";
import { craftingCost, fmt } from "../utils/helpers";
import { useCreateAlchemyItemMutation } from "../hooks/mutations/mutations";


export function GroupTable({
  group,
  state,
  setState,
  onAddRecipe,
  customPriceMap,
}: {
  group: Group;
  state: Record<string, RowState>;
  setState: (name: string, s: RowState) => void;
  onAddRecipe: (groupKey: Group["key"], recipe: Recipe) => void;
  customPriceMap?: Record<string, number>;
}) {
  const [draft, setDraft] = useState<DraftRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const existingNames = useMemo(
    () => new Set(group.recipes.map((r) => r.name)),
    [group.recipes],
  );

  const {mutateAsync: createAlchemyItem } = useCreateAlchemyItemMutation();


  const rows = group.recipes.map((r) => {
    const cost = craftingCost(r, customPriceMap);
    const breakeven = cost / (1 - AH_CUT);
    const s = state[r.name];
    const ah = s.ahPrice;
    const qty = s.qty;
    const profitPer = ah * (1 - AH_CUT) - cost;
    const roi = cost > 0 ? (profitPer / cost) * 100 : 0;
    const totalCost = cost * qty;
    const expected = profitPer * qty;
    return { r, cost, breakeven, profitPer, roi, totalCost, expected };
  });

  const totals = rows.reduce(
    (a, b) => ({ cost: a.cost + b.totalCost, expected: a.expected + b.expected }),
    { cost: 0, expected: 0 },
  );
  const qtySum = rows.reduce((a, b) => a + state[b.r.name].qty, 0);

  const startDraft = () => {
    setError(null);
    setDraft({ id: 0, name: "", ahPrice: 0, qty: 0 });
  };
  const cancelDraft = () => {
    setError(null);
    setDraft(null);
  };
  const saveDraft = () => {
    if (!draft) return;
    if (!draft.name.trim()) {
      setError("Please select an item.");
      return;
    }
    if (existingNames.has(draft.name)) {
      setError("Item already in table.");
      return;
    }
    onAddRecipe(group.key, {
      name: draft.name,
      reagents: [],
      defaultAHPrice: draft.ahPrice,
      defaultQty: draft.qty,
    });
    setDraft(null);
    setError(null);
  };

    const handleCreateAlchemyItem = async (group: string, itemId: number) => {
    await createAlchemyItem({
      group,
      item_id: itemId,
    });
    saveDraft();
  }

  const draftCost = draft ? (customPriceMap?.[draft.name] ?? priceMap[draft.name] ?? 0) : 0;
  const draftBreakeven = draftCost / (1 - AH_CUT);
  const draftProfit = draft ? draft.ahPrice * (1 - AH_CUT) - draftCost : 0;
  const draftRoi = draftCost > 0 ? (draftProfit / draftCost) * 100 : 0;

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl text-gold uppercase tracking-[0.2em] border-l-4 border-primary pl-4">
        {group.title}
      </h2>
      <div className="group/table border border-border/70 bg-card/40 shadow-panel overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="bg-secondary/40 border-b border-border/70 hover:bg-secondary/40">
              <TableHead className="h-10 text-muted-foreground uppercase tracking-wider text-xs">Name</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Crafting Cost</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Breakeven</TableHead>
              <TableHead className="h-10 text-center w-28 text-muted-foreground uppercase tracking-wider text-xs">AH Price</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Profit/Item</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">ROI%</TableHead>
              <TableHead className="h-10 text-center w-24 text-muted-foreground uppercase tracking-wider text-xs">QTY</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Cost</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Expected Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ r, cost, breakeven, profitPer, roi, totalCost, expected }) => {
              const s = state[r.name];
              const positive = profitPer >= 0;
              return (
                <TableRow key={r.name} className="border-b border-border/40 hover:bg-secondary/30">
                  <TableCell className="py-2 font-medium text-gold">{r.name}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(cost, 3)}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">{fmt(breakeven, 3)}</TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={s.ahPrice}
                      onChange={(e) => setState(r.name, { ...s, ahPrice: parseFloat(e.target.value) || 0 })}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono font-medium", positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {positive ? "+" : ""}{fmt(profitPer, 3)}
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono", roi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {fmt(roi, 2)}%
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="1"
                      value={s.qty}
                      onChange={(e) => setState(r.name, { ...s, qty: parseInt(e.target.value) || 0 })}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(totalCost)}</TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono font-medium", expected >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {fmt(expected)}
                  </TableCell>
                </TableRow>
              );
            })}

            {draft ? (
              <>
                <TableRow className="bg-primary/5 border-b border-primary/30 hover:bg-primary/5">
                  <TableCell className="py-2">
                    <ItemCombobox
                      value={draft.name}
                      onChange={(name, id) => {
                        setError(null);
                        setDraft({ ...draft, name, id, ahPrice: draft.ahPrice || 0 });
                      }}
                      groupClass={group.searchGroup}
  
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(draftCost, 3)}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">{fmt(draftBreakeven, 3)}</TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.ahPrice}
                      onChange={(e) => setDraft({ ...draft, ahPrice: parseFloat(e.target.value) || 0 })}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono", draftProfit >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {draftProfit >= 0 ? "+" : ""}{fmt(draftProfit, 3)}
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono", draftRoi >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {fmt(draftRoi, 2)}%
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="1"
                      value={draft.qty}
                      onChange={(e) => setDraft({ ...draft, qty: parseInt(e.target.value) || 0 })}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell colSpan={2} className="py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={cancelDraft} className="h-8 gap-1">
                        <X className="h-3.5 w-3.5" /> Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleCreateAlchemyItem(group.key, draft.id)} disabled={!draft.name} className="h-8 gap-1">
                        <Check className="h-3.5 w-3.5" /> Save
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {error && (
                  <TableRow className="bg-destructive/10 hover:bg-destructive/10">
                    <TableCell colSpan={9} className="py-1.5 text-xs text-destructive">
                      {error}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow className="group/add border-b-0 hover:bg-transparent">
                <TableCell colSpan={9} className="p-0">
                  <button
                    type="button"
                    onClick={startDraft}
                    className="w-full h-7 flex items-center justify-center gap-2 text-xs text-muted-foreground opacity-0 group-hover/table:opacity-100 hover:bg-primary/10 hover:text-primary transition-all border-t border-dashed border-border/50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add row
                  </button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-secondary/50 border-t-2 border-primary/40 font-bold hover:bg-secondary/50">
              <TableCell className="py-3 font-display uppercase tracking-widest text-gold">Total</TableCell>
              <TableCell colSpan={5} />
              <TableCell className="py-3 text-center tabular-nums font-mono text-gold">{qtySum}</TableCell>
              <TableCell className="py-3 text-right tabular-nums font-mono text-gold">{fmt(totals.cost)}</TableCell>
              <TableCell className={cn("py-3 text-right tabular-nums font-mono", totals.expected >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                {fmt(totals.expected)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
