import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { fmt } from "../utils/helpers";
import type { JewelcraftingRawGem } from "../types/types";

interface ProspectingRow extends JewelcraftingRawGem {
  ah: number;
  vendor: number;
  subtotal: number;
  expected: number;
  obtenido: number;
  precioObtenido: number;
  prospectPrice: number;
}

interface ProspectingResultsTableProps {
  rows: ProspectingRow[];
  vendorEnabled: boolean;
  setVendorEnabled: (enabled: boolean) => void;
  setAhPrice: (name: string, price: number) => void;
  setProspectPrice: (name: string, price: number, subtotal?: number) => void;
  setObtenidoOverrides: (updater: (prev: Record<string, number>) => Record<string, number>) => void;
  totalReal: number;
}

export function ProspectingResultsTable({
  rows,
  vendorEnabled,
  setVendorEnabled,
  setAhPrice,
  setProspectPrice,
  setObtenidoOverrides,
  totalReal,
}: ProspectingResultsTableProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl text-gold uppercase tracking-[0.2em] border-l-4 border-primary pl-4">
        Estimate Results
      </h2>
      <div className="border border-border/70 bg-card/40 shadow-panel overflow-hidden">
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="bg-secondary/40 border-b border-border/70 hover:bg-secondary/40">
              <TableHead className="h-10 uppercase tracking-wider text-xs">Gem</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Chance</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Expected</TableHead>
              <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">AH Price</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">
                <div className="flex items-center justify-end gap-2">
                  <span>Vendor</span>
                  <Switch
                    checked={vendorEnabled}
                    onCheckedChange={setVendorEnabled}
                    className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 data-[state=checked]:[&>span]:translate-x-3"
                  />
                </div>
              </TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">SubTotal</TableHead>
              <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-28">Obtenido</TableHead>
              <TableHead className="h-10 text-right uppercase tracking-wider text-xs">Precio Obtenido</TableHead>
              <TableHead className="h-10 text-center uppercase tracking-wider text-xs w-32">Prospecting Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const ahCopper = r.ah;
              return (
                <TableRow key={r.name} className="border-b border-border/40 hover:bg-secondary/30">
                  <TableCell className="py-2 font-medium text-gold">{r.name}</TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-muted-foreground">
                    {(r.procChance * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono">{fmt(r.expected, 2)}</TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={ahCopper === 0 ? "" : ahCopper}
                      placeholder="—"
                      onChange={(e) => setAhPrice(r.name, (parseFloat(e.target.value) || 0) * 10000)}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  <TableCell className={cn("py-2 text-right tabular-nums font-mono", vendorEnabled ? "text-muted-foreground" : "text-muted-foreground/40")}>
                    {r.vendor ? fmt(r.vendor, 2) : "—"}
                  </TableCell>
                  <TableCell className="py-2 text-right tabular-nums font-mono text-[hsl(var(--quality-uncommon))]">
                    {fmt(r.subtotal, 2)}
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      value={r.obtenido}
                      onChange={(e) => {
                        setObtenidoOverrides((p) => ({ ...p, [r.name]: parseInt(e.target.value) || 0 }));
                        setProspectPrice(r.name, parseFloat(e.target.value) || 0, r.subtotal);
                        }
                      }
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                  
                  <TableCell className="py-2 text-right tabular-nums font-mono text-gold">{fmt(r.precioObtenido, 2)}</TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={r.prospectPrice}
                      onChange={(e) => setProspectPrice(r.name, parseFloat(e.target.value) || 0)}
                      className="h-8 w-full text-center tabular-nums font-mono bg-background border-border/70 text-gold focus-visible:border-primary"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-secondary/50 border-t-2 border-primary/40 hover:bg-secondary/50">
              <TableCell colSpan={5} className="py-3 font-bold text-gold uppercase tracking-wider text-xs">Total</TableCell>
              <TableCell className="py-3 text-right tabular-nums font-mono font-bold text-gold">
                {fmt(rows.reduce((a, b) => a + b.subtotal, 0), 2)}
              </TableCell>
              <TableCell />
              <TableCell className="py-3 text-right tabular-nums font-mono font-bold text-gold">
                {fmt(totalReal, 2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
}