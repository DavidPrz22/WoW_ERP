import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EXPLOSIVES } from "../data";
import { ResultCells } from "@/components/ui/data-table/ResultCells";

export function ExplosivesTable() {
  const [buyReagents, setBuyReagents] = useState<Record<string, boolean>>({});

  return (
    <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="bg-secondary/50 border-b border-primary/20 hover:bg-secondary/50">
            <TableHead className="h-10 uppercase tracking-wider text-xs">Item</TableHead>
            <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-28">Buy Reagents</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven</TableHead>
            <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">AH Price</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit / Item</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {EXPLOSIVES.map((it) => {
            const buying = !!buyReagents[it.name];
            const cost = buying && it.reagentCost ? it.reagentCost : it.craftingCost;
            return (
              <TableRow key={it.name} className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
                <TableCell className="py-2 font-medium text-gold">
                  <div className="flex items-center gap-2">
                    <span>{it.name}</span>
                    {buying && (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider px-2 py-0.5 border border-primary/30 text-primary/90 bg-primary/10 rounded-sm">
                        <span className="w-1 h-1 rounded-full bg-primary/70" />
                        Buying
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-2 text-center">
                  <div className="flex justify-center">
                    <Switch
                      checked={buying}
                      onCheckedChange={(v) => setBuyReagents((s) => ({ ...s, [it.name]: v }))}
                    />
                  </div>
                </TableCell>
                <ResultCells row={{ name: it.name, cost, ah: it.ahPrice }} />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
