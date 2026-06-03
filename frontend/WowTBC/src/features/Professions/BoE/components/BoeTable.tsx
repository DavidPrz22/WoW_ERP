import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BoeItem, NetherPrices } from "../types/types";
import { BoeTableRow } from "./BoeTableRow";
import { BoeEmptyState } from "./BoeEmptyState";

export interface BoeTableProps {
  items: BoeItem[];
  netherPrices: NetherPrices;
}

export function BoeTable({ items, netherPrices }: BoeTableProps) {
  if (items.length === 0) {
    return <BoeEmptyState />;
  }

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
          {items.map((it) => (
            <BoeTableRow key={it.name} item={it} netherPrices={netherPrices} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
