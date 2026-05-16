import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PriceTablePanel } from "./SystemRecordsTable";
import { useRecordsStore } from "@/ZustandStores/useRecordsStore";

export function SystemPriceTable() {
  const { setShowPrices } = useRecordsStore();

  return (
    <div className="md:px-12 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-gold">Price Table</h1>
          <p className="text-muted-foreground text-sm">Reagent prices grouped by category. Override values inline.</p>
        </div>
        <Button variant="outline" className="border-primary/40" onClick={() => setShowPrices(false)}>
          <X className="mr-2 h-4 w-4" /> Close
        </Button>
      </div>
      <Card className="bg-card/60 border-border shadow-panel">
        <CardContent>
          <PriceTablePanel />
        </CardContent>
      </Card>
    </div>
  );
}
