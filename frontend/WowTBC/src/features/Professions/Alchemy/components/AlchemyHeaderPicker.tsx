import {History } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fmt } from "../utils/helpers";
import { cn } from "@/lib/utils";

const SAMPLE_RECORDS = [
  { id: "REC-1042", label: "Snapshot · Gehennas-Horde", time: "2h ago", value: 114.98 },
  { id: "REC-1039", label: "Snapshot · Gehennas-Horde", time: "8h ago", value: 112.50 },
  { id: "REC-1031", label: "Snapshot · Firemaw-Alliance", time: "1d ago", value: 118.75 },
  { id: "REC-1024", label: "Snapshot · Mograine-Horde", time: "2d ago", value: 109.20 },
  { id: "REC-1018", label: "Snapshot · Golemagg-Horde", time: "3d ago", value: 121.40 },
  { id: "REC-1007", label: "Snapshot · Pyrewood-Alliance", time: "5d ago", value: 116.05 },
];

export function HeaderPickerDialog({
  column,
  align = "left",
  className,
}: {
  column: string;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  const alignCls = align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "group/header inline-flex w-full items-center gap-1.5 uppercase tracking-wider text-xs text-muted-foreground transition-colors hover:text-gold focus-visible:text-gold focus-visible:outline-none",
            alignCls,
            className,
          )}
        >
          <span>{column}</span>
          <History className="h-3 w-3 opacity-0 transition-opacity group-hover/header:opacity-70" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-border/70 bg-card/95 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="font-display text-gold uppercase tracking-[0.18em] text-base flex items-center gap-2">
            <History className="h-4 w-4" />
            {column} · Records
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-2">
          Select a record to populate <span className="text-gold">{column}</span> for every row.
        </p>
        <div className="border border-border/70 bg-background/60 divide-y divide-border/50 max-h-[360px] overflow-auto">
          {SAMPLE_RECORDS.map((rec) => (
            <button
              key={rec.id}
              type="button"
              className="w-full grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50 focus-visible:bg-secondary/60 focus-visible:outline-none group"
            >
              <div className="min-w-0">
                <div className="text-xs font-mono text-muted-foreground tracking-wide">{rec.id}</div>
                <div className="text-sm text-gold truncate group-hover:text-primary transition-colors">
                  {rec.label}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                  {rec.time}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono tabular-nums text-gold">{fmt(rec.value, 2)}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">value</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}