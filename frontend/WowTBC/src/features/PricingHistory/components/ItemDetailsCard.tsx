import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatGold, qualityColor } from "@/data/mock";
import type { ItemDetailsCardProps } from "../types";

export function ItemDetailsCard({ selected, lastRecord }: ItemDetailsCardProps) {
  return (
    <Card className="bg-card/60 border-border shadow-panel lg:col-span-1">
      <CardHeader>
        <CardTitle className="font-display text-gold flex items-center gap-2">
          <span className="text-2xl">{selected.icon}</span>
          <span style={{ color: qualityColor[selected.quality] }}>{selected.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Class</span><span>{selected.itemClass}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Subclass</span><span>{selected.subclass}</span></div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quality</span>
          <Badge variant="outline" style={{ borderColor: qualityColor[selected.quality], color: qualityColor[selected.quality] }}>
            {selected.quality}
          </Badge>
        </div>
        <div className="h-px bg-border my-2" />
        <Stat label="Market Value" value={formatGold(lastRecord.marketValue)} />
        <Stat label="Min Buyout" value={formatGold(lastRecord.minBuyout)} />
        <Stat label="Historical" value={formatGold(lastRecord.historical)} />
        <Stat label="Auctions" value={lastRecord.numAuctions.toString()} />
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-gold">{value}</span>
    </div>
  );
}
