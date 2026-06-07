interface BoeEmptyStateProps {
  message?: string;
}


export function BoeEmptyState({ message }: BoeEmptyStateProps) {
  return (
    <div className="border border-dashed border-border/60 bg-card/20 px-6 py-10 text-center text-xs uppercase tracking-wider text-muted-foreground">
      {message || "No items in this section"}
    </div>
  );
}
