import { TableHead } from "@/components/ui/table";

export function ResultHeaderCells() {
  return (
    <>
      <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Crafting Cost</TableHead>
      <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Breakeven</TableHead>
      <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-28">AH Price</TableHead>
      <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Profit / Item</TableHead>
      <TableHead className="h-10 text-right uppercase tracking-wider text-xs">ROI %</TableHead>
    </>
  );
}
