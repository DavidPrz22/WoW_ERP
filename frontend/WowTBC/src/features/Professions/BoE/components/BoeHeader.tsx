
export interface BoeHeaderProps {
  title: string;
  description: string;
  icon: any;
}

export function BoeHeader({ title, description, icon: Icon }: BoeHeaderProps) {
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
