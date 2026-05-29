import React from "react";

interface MetricCardProps {
  label: string;
  children: React.ReactNode;
}

export function MetricCard({ label, children }: MetricCardProps) {
  return (
    <div className="border border-border/70 bg-card/40 px-5 py-4 shadow-panel">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">{label}</div>
      {children}
    </div>
  );
}
