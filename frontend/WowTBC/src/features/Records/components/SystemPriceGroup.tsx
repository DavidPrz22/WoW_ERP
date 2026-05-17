import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Check, X, Pencil, RotateCcw } from "lucide-react";
import { IconImg } from "@/components/IconImg";
import type { PriceEntry, PriceGroup } from "../types";

export function PriceGroupSection({
  group,
  overrides,
  editing,
  startEdit,
  commit,
  reset,
  cancel,
  formatPrice,
}: {
  group: PriceGroup;
  overrides: Record<string, { value: number; previous: number }>;
  editing: string | null;
  startEdit: (key: string, current: number) => void;
  commit: (key: string, entry: PriceEntry, newPrice: number) => void;
  reset: (entry: PriceEntry, key: string) => void;
  cancel: () => void;
  formatPrice: (g: number) => string;
}) {

  const overriddenCount = group.entries.filter((e) => overrides[e.name]).length;
  const totalItems = group.entries.length;
  const title = group.title;

  return (
    <AccordionItem value={group.title} className="border border-border rounded-md bg-secondary/20 px-3">
      <AccordionTrigger className="hover:no-underline py-3">
        <div className="flex items-center gap-3">
          <span className="font-display text-gold tracking-wide uppercase text-sm">{title}</span>
          <Badge variant="outline" className="text-xs border-border">{totalItems}</Badge>
          {overriddenCount > 0 && (
            <Badge className="text-xs bg-accent/20 text-accent border-accent/40" variant="outline">
              {overriddenCount} edited
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-3">
        <div className="rounded-md border border-border overflow-hidden bg-background/30">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-8">Item</TableHead>
                <TableHead className="h-8 text-right">Price</TableHead>
                <TableHead className="h-8 w-[110px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.entries.map((entry: PriceEntry) => {
                const override = entry.overridenPrice;
                const current = entry.price;
                const isEditing = editing === entry.name;

                return (
                  <TableRow key={entry.name}>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded border border-border bg-secondary/40 flex items-center justify-center overflow-hidden shrink-0">
                          {entry.icon ? (
                            <IconImg src={entry.icon} alt={entry.name} />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <span>{entry.name}</span>
                      </div>
                    </TableCell>


                    <TableCell className="py-2 text-right">
                      {isEditing ? (
                        <Input
                          autoFocus
                          type="number"
                          step="0.0001"
                          defaultValue={override ? override : current}
                          id={`edit-input-${entry.name}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commit(entry.name, entry, Number(e.currentTarget.value));
                            if (e.key === "Escape") cancel();
                          }}
                          className="h-8 w-28 ml-auto bg-secondary/60 text-right font-mono"
                        />
                      ) : (
                        <div className="flex flex-col items-end">
                          {override ? (
                            <>
                              <span className="text-md text-gold font-mono">
                                {formatPrice(override)}
                              </span>
                              <span className="text-xs line-through font-mono text-accent">
                                {formatPrice(current)}
                              </span>
                            </>
                          ) : 
                          <span className="font-mono text-gold">
                            {formatPrice(current)}
                          </span>}
                        </div>
                      )}
                    </TableCell>


                    <TableCell className="py-2 text-right">
                      {isEditing ? (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                            const val = (document.getElementById(`edit-input-${entry.name}`) as HTMLInputElement)?.value;
                            commit(entry.name, entry, Number(val));
                          }}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={cancel}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(entry.name, current)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {override && (
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => reset(entry, entry.name)}>
                              <RotateCcw className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}