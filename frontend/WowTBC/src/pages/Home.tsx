import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, LineChart, Sparkles } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { records, items, formatGold, generateHistory, qualityColor } from "@/data/mock";

export default function Home() {
  const latest = records.slice(0, 5);
  const trending = items.slice(0, 4).map((it) => {
    const h = generateHistory(it.id, 7);
    const last = h[h.length - 1];
    const prev = h[0];
    const change = ((last.marketValue - prev.marketValue) / prev.marketValue) * 100;
    return { it, last, change };
  });

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={hero}
          alt="WoW TBC auction house illustration"
          width={1600}
          height={896}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative px-6 md:px-12 py-20 md:py-28 max-w-5xl">
          <Badge variant="outline" className="mb-6 border-primary/40 text-gold uppercase tracking-widest">
            Burning Crusade Edition
          </Badge>
          <h1 className="font-display text-5xl md:text-7xl text-gold leading-[1.05] mb-6">
            Master the Auction House.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Track item prices, ingestion snapshots, and market trends across realms and factions.
            Built for the serious gold maker.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold">
              <Link to="/pricing">
                Explore Pricing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/40">
              <Link to="/records">View Records</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 py-12 grid gap-6 md:grid-cols-3">
        {[
          { icon: Database, label: "Snapshots", value: records.length, hint: "Total ingestion records" },
          { icon: Sparkles, label: "Tracked Items", value: items.length.toLocaleString(), hint: "Across all categories" },
          { icon: LineChart, label: "Realms", value: 5, hint: "Horde & Alliance" },
        ].map((s) => (
          <Card key={s.label} className="bg-card/60 border-border shadow-panel">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-md bg-secondary flex items-center justify-center text-gold">
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-3xl font-display text-gold">{s.value}</div>
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground">{s.hint}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="px-6 md:px-12 pb-12 grid gap-6 lg:grid-cols-2">
        <Card className="bg-card/60 border-border shadow-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-gold">Latest Records</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/records">All <ArrowRight className="ml-1 h-3 w-3"/></Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {latest.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
                  <span className="font-medium">{r.realm}</span>
                  <Badge variant="outline" className={r.faction === "Horde" ? "border-[hsl(var(--faction-horde))] text-[hsl(var(--faction-horde))]" : "border-[hsl(var(--faction-alliance))] text-[hsl(var(--faction-alliance))]"}>
                    {r.faction}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(r.timestamp).toLocaleString()} · {r.items.toLocaleString()} items
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-border shadow-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-gold">Latest Pricing</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/pricing">All <ArrowRight className="ml-1 h-3 w-3"/></Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {trending.map(({ it, last, change }) => (
              <div key={it.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{it.icon}</span>
                  <div>
                    <div style={{ color: qualityColor[it.quality] }} className="font-medium text-sm">{it.name}</div>
                    <div className="text-xs text-muted-foreground">{it.itemClass} · {it.subclass}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gold font-mono">{formatGold(last.marketValue)}</div>
                  <div className={`text-xs ${change >= 0 ? "text-[hsl(var(--quality-uncommon))]" : "text-destructive"}`}>
                    {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}