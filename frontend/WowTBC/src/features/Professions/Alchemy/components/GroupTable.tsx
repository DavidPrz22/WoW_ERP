import { useState, useMemo } from 'react'
import { Plus, X, Check, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AlchemyGroup, AlchemyImportRecord, AlchemyItemCalculation } from "../types";
import { fmt, calculateBreakeven, calculateProfitPerItem, calculateROI, calculateTotalCost, calculateExpectedProfit } from "../utils/helpers";
import { QtyInput } from "./QtyInput";
import type { AlchemyGroupTableRow } from "../types";
import { HeaderPickerDialog } from "./AlchemyHeaderPicker";
import { WowCurrency } from "./WowCurrency";
import { useAlchemyStore } from '@/ZustandStores/useAlchemyStore';
import { ItemCombobox } from "./ItemCombobox";
import { Button } from "@/components/ui/button";
import { useCreateAlchemyItemMutation } from "../hooks/mutations/mutations";

export function GroupTable({
  group,
  qtys,
  setQty,
}: {
  group: AlchemyGroup;
  qtys: Record<string, number>;
  setQty: (name: string, q: number) => void;
}) {

  const [alchemyImportData, setAlchemyImportData] = useState<AlchemyImportRecord | null>(null);
  const { dataRecordId } = useAlchemyStore();

  const [draft, setDraft] = useState<{ name: string; id: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const existingNames = useMemo(
    () => new Set(group.items.map((r) => r.name)),
    [group],
  );

  const { mutate: createItem, isPending } = useCreateAlchemyItemMutation();

  const startDraft = () => {
    setError(null);
    setDraft({ name: "", id: 0 });
  };
  const cancelDraft = () => {
    setError(null);
    setDraft(null);
  };
  const saveDraft = () => {
    if (!draft) return;
    if (!draft.name.trim() || draft.id === 0) {
      setError("Please select an item.");
      return;
    }
    if (existingNames.has(draft.name)) {
      setError("Item already in table.");
      return;
    }

    createItem({ group: group.group, item_id: draft.id }, {
      onSuccess: () => {
        setDraft(null);
        setError(null);
      },
      onError: () => {
        setError("Failed to add item.");
      }
    });
  };

  const handleSetImportData = (column: string, recordId: string) => {
    setAlchemyImportData((prev) => ({ ...prev, [column]: recordId }));
  };

  const rows: AlchemyGroupTableRow[] = group.items.map((item) => {
      const qty = qtys[item.name] || 0;
      const profitPerItem = calculateProfitPerItem(item.AHPrice, item.craftingCost);
      const breakeven = calculateBreakeven(item.craftingCost);
      const ROI = calculateROI(profitPerItem, item.craftingCost);
      const totalCost = calculateTotalCost(item.craftingCost, qty);
      const expected = calculateExpectedProfit(profitPerItem, qty);
    
      return { item, qty, totalCost, expected, profitPerItem, breakeven, ROI };
  });

  const totals = rows.reduce(
    (a, b) => ({ cost: a.cost + b.totalCost, expected: a.expected + b.expected }),
    { cost: 0, expected: 0 },
  );

  const qtySum = rows.reduce((a, b) => a + b.qty, 0);

  const checkImportedId = (column: string) => {
    if (!alchemyImportData) return false;
    const ImportedColumns: (keyof Pick<AlchemyItemCalculation, "AHPrice" | "craftingCost">)[] = Object.keys(alchemyImportData || {}) as ("AHPrice" | "craftingCost")[];
    
    const importedRecordId = alchemyImportData[column as keyof AlchemyImportRecord];
    return ImportedColumns.includes(column as keyof Pick<AlchemyItemCalculation, "AHPrice" | "craftingCost">) && importedRecordId !== dataRecordId;
  };
  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl text-gold uppercase tracking-[0.2em] border-l-4 border-primary pl-4">
        {group.group}
      </h2>
      <div className="group/table border border-border/70 bg-card/40 shadow-panel overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="bg-secondary/40 border-b border-border/70 hover:bg-secondary/40">
              <TableHead className="h-10 text-muted-foreground uppercase tracking-wider text-xs">Name</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">
                <HeaderPickerDialog column="craftingCost" group={group.group} importData={alchemyImportData} setImportData={handleSetImportData}/>
              </TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Breakeven</TableHead>
              <TableHead className="h-10 text-center w-28 text-muted-foreground uppercase tracking-wider text-xs">
                <HeaderPickerDialog column="AHPrice" group={group.group} importData={alchemyImportData} setImportData={handleSetImportData}/>
              </TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Profit/Item</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">ROI%</TableHead>
              <TableHead className="h-10 text-center w-24 text-muted-foreground uppercase tracking-wider text-xs">QTY</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Cost</TableHead>
              <TableHead className="h-10 text-right text-muted-foreground uppercase tracking-wider text-xs">Expected Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ item, qty, totalCost, expected, profitPerItem, breakeven, ROI }) => {
              const positive = profitPerItem >= 0;
              return (
                <TableRow key={item.name} className="border-b border-border/40 hover:bg-secondary/30">
                  <TableCell className="py-2 font-medium text-gold">{item.name}</TableCell>
                  <TableCell className={cn("py-2 text-right", checkImportedId("craftingCost") && "bg-primary/10")}><WowCurrency value={item.craftingCost} /></TableCell>
                  <TableCell className="py-2 text-right text-muted-foreground"><WowCurrency value={breakeven} /></TableCell>
                  <TableCell className={cn("py-2 text-center text-gold", checkImportedId("AHPrice") && "bg-primary/10")}>
                    <WowCurrency value={item.AHPrice} />
                  </TableCell>
                  <TableCell className={cn("py-2 text-right font-medium", positive ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    <WowCurrency value={profitPerItem} isProfit={true} />
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono", ROI >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    {fmt(ROI, 2)}%
                  </TableCell>
                  <TableCell className="py-2">
                    <QtyInput
                      value={qty}
                      onChange={(val) => setQty(item.name, val)}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right"><WowCurrency value={totalCost} /></TableCell>
                  <TableCell className={cn("py-2 text-right font-medium", expected >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                    <WowCurrency value={expected} isProfit={true} />
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
                      groupClass={group.search_group}
                      onChange={(name, id) => {
                        setError(null);
                        setDraft({ name, id });
                      }}
                      excluded={existingNames}
                    />
                  </TableCell>
                  <TableCell className="py-2 text-right text-muted-foreground">-</TableCell>
                  <TableCell className="py-2 text-right text-muted-foreground">-</TableCell>
                  <TableCell className="py-2 text-center text-muted-foreground">-</TableCell>
                  <TableCell className="py-2 text-right text-muted-foreground">-</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">-</TableCell>
                  <TableCell className="py-2 text-center text-muted-foreground">-</TableCell>
                  <TableCell colSpan={2} className="py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={cancelDraft} className="h-8 gap-1">
                        <X className="h-3.5 w-3.5" /> Cancel
                      </Button>
                      <Button size="sm" onClick={saveDraft} disabled={!draft.name || isPending} className="h-8 gap-1">
                        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {error && (
                  <TableRow className="bg-destructive/10 hover:bg-destructive/10">
                    <TableCell colSpan={9} className="py-1.5 text-xs text-destructive text-center">
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
              <TableCell className="py-3 text-right text-gold"><WowCurrency value={totals.cost} /></TableCell>
              <TableCell className={cn("py-3 text-right", totals.expected >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive")}>
                <WowCurrency value={totals.expected} isProfit={true} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}
