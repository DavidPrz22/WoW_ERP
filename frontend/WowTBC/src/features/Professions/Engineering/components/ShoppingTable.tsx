import { QtyInput } from "./QtyInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function ShoppingTable({
  needs,
  inventory,
  setInventory,
}: {
  needs: Record<string, number>;
  inventory: Record<string, number>;
  setInventory: (name: string, v: number) => void;
}) {
  const items = Object.entries(needs).sort((a, b) => a[0].localeCompare(b[0]));
  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground py-8 text-center">No reagents needed — set QTY on items first.</div>;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Amount to Buy</TableHead>
          <TableHead className="text-right">In Inventory</TableHead>
          <TableHead className="text-right">Difference</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(([name, need]) => {
          const have = inventory[name] ?? 0;
          const diff = need - have;
          return (
            <TableRow key={name}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell className="text-right tabular-nums">{Math.ceil(need)}</TableCell>
              <TableCell className="text-right">
                <QtyInput
                  value={have}
                  onChange={(val) => setInventory(name, val)}
                  className="h-8 w-24 ml-auto text-right tabular-nums"
                />
              </TableCell>
              <TableCell
                className={cn(
                  "text-right tabular-nums font-medium",
                  diff > 0 ? "text-destructive" : "text-[hsl(var(--quality-uncommon))]",
                )}
              >
                {diff > 0 ? `${Math.ceil(diff)}` : diff < 0 ? `+${Math.abs(diff)}` : "0"}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
