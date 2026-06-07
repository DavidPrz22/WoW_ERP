import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PARTS } from "../data";
import { ResultCells } from "@/components/ui/data-table/ResultCells";

export function PartsTable() {
  return (
    <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden rounded-sm">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="bg-secondary/50 border-b border-primary/20 hover:bg-secondary/50">
            <TableHead className="h-10 uppercase tracking-wider text-xs">Item</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven</TableHead>
            <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">AH Price</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit / Item</TableHead>
            <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PARTS.map((it) => (
            <TableRow key={it.name} className="border-b border-border/30 hover:bg-secondary/40 transition-colors duration-150">
              <TableCell className="py-2 font-medium text-gold">{it.name}</TableCell>
              <ResultCells row={{ name: it.name, cost: it.craftingCost, ah: it.ahPrice }} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
