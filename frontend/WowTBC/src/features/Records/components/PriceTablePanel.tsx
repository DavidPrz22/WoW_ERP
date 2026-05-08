import { useState } from "react";
import { items, realms, qualityColor, generateHistory, formatGold, type Faction } from "@/data/mock";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function PriceTablePanel() {
  const [itemId, setItemId] = useState<number>(items[0].id);
  const item = items.find((i) => i.id === itemId)!;
  const factions: Faction[] = ["Horde", "Alliance"];

  return (
    <div className="mt-6 space-y-4">
      <Select value={String(itemId)} onValueChange={(v) => setItemId(Number(v))}>
        <SelectTrigger className="bg-secondary/40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((i) => (
            <SelectItem key={i.id} value={String(i.id)}>
              <span style={{ color: qualityColor[i.quality] }}>{i.icon} {i.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Realm</TableHead>
              <TableHead>Faction</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {realms.flatMap((realm) =>
              factions.map((f) => {
                const h = generateHistory(item.id + realm.length + f.length, 2);
                return (
                  <TableRow key={`${realm}-${f}`}>
                    <TableCell>{realm}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={f === "Horde" ? "border-[hsl(var(--faction-horde))] text-[hsl(var(--faction-horde))]" : "border-[hsl(var(--faction-alliance))] text-[hsl(var(--faction-alliance))]"}>
                        {f}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-gold">
                      {formatGold(h[h.length - 1].marketValue)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
