import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { useHomeRecords } from "@/features/Home/hooks/queries/useHomeData";
import { ProfessionCards } from "@/features/Home/components/ProfessionCards";
import { QuickLinks } from "@/features/Home/components/QuickLinks";

export default function Home() {
  const { data: recordsData, isLoading: recordsLoading } = useHomeRecords();

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

      <section className="px-6 md:px-12 py-12">
        <h2 className="font-display text-2xl text-gold mb-6">Quick Links</h2>
        <QuickLinks />
      </section>

      <section className="px-6 md:px-12 py-6 space-y-4">
        <h2 className="font-display text-2xl text-gold">Professions</h2>
        <ProfessionCards />
      </section>

      <section className="px-6 md:px-12 pb-12">
        <Card className="bg-card/60 border-border shadow-panel">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-gold">Latest Records</CardTitle>
            <Button asChild size="sm" variant="ghost"><Link to="/records">All <ArrowRight className="ml-1 h-3 w-3"/></Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {recordsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              recordsData?.results?.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
                    <span className="font-medium">{r.realm_name}</span>
                    <Badge variant="outline" className={r.faction === "Horde" ? "border-[hsl(var(--faction-horde))] text-[hsl(var(--faction-horde))]" : "border-[hsl(var(--faction-alliance))] text-[hsl(var(--faction-alliance))]"}>
                      {r.faction}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.timestamp).toLocaleString()} · {r.item_count.toLocaleString()} items
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}