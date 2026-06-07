import type { LucideIcon } from "lucide-react";

export interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-md bg-gradient-gold shadow-gold flex items-center justify-center text-primary-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <h1 className="font-display text-4xl text-gold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
