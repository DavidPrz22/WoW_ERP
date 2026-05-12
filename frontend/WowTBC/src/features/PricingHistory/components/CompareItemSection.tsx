import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { SERIES_COLORS } from "@/data/ItemsColors";
import { qualityColor } from "@/data/ItemsColors";
import { IconImg } from "@/components/IconImg";

interface CompareItemSectionProps {
  bucket: any[];
  removeItem: (id: string) => void;
}

export const CompareItemSection = ({ bucket, removeItem }: CompareItemSectionProps) => {
    return (
        <Card className="bg-card/60 border-border shadow-panel">
          <CardContent className="p-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase tracking-wide text-muted-foreground mr-1">Compare</span>
            {bucket.length === 0 && (
              <span className="text-xs text-muted-foreground">Selecciona un items arriba.</span>
            )}
            {bucket.map((i, idx) => (
              <div key={i.id} className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 pl-2 pr-1 py-1">
                <span className="h-2 w-2 rounded-full" style={{ background: SERIES_COLORS[idx % SERIES_COLORS.length] }} />
                <IconImg src={`/icons/${i.icon}`} alt={i.name} className="size-4" />
                <span style={{ color: qualityColor[i.quality] }} className="text-xs font-medium">{i.name}</span>
                <button onClick={() => removeItem(i.id)} className="text-muted-foreground hover:text-foreground p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
    );
};