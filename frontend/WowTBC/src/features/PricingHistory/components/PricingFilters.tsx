import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { itemClasses, qualities, qualityColor } from "@/data/mock";
import { cn } from "@/lib/utils";
import { usePricingHistoryStore } from "@/ZustandStores/usePricingHistoryStore";
import type { PricingFiltersProps } from "../types";

export function PricingFilters({
  query, setQuery, open, setOpen,
  suggestions, subOptions
}: PricingFiltersProps) {
  const {
    setSelected, cls, setCls, sub, setSub,
    quality, setQuality, faction, setFaction,
    realm, setRealm,
    range, setRange
  } = usePricingHistoryStore();
  return (
    <Card className="bg-card/60 border-border shadow-panel">
      <CardContent className="p-5 grid gap-4 md:grid-cols-12">
        <div className="relative md:col-span-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items…"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className="pl-9 bg-secondary/40"
          />
          {open && suggestions.length > 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-md border border-border bg-popover shadow-panel max-h-72 overflow-auto">
              {suggestions.map((i) => (
                <button
                  key={i.id}
                  onMouseDown={() => { setSelected(i); setQuery(i.name); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent/30 transition-colors"
                >
                  <span className="text-lg">{i.icon}</span>
                  <span style={{ color: qualityColor[i.quality] }} className="text-sm font-medium">{i.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{i.itemClass}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <Select value={cls} onValueChange={(v) => { setCls(v); setSub("all"); }}>
          <SelectTrigger className="md:col-span-4 bg-secondary/40"><SelectValue placeholder="Class" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {Object.keys(itemClasses).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={sub} onValueChange={setSub} disabled={cls === ""}>
          <SelectTrigger className="md:col-span-4 bg-secondary/40"><SelectValue placeholder="Subclass" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subclasses</SelectItem>
            {subOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={quality} onValueChange={setQuality}>
          <SelectTrigger className="md:col-span-4 bg-secondary/40"><SelectValue placeholder="Quality" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All qualities</SelectItem>
            {qualities.map((q) => <SelectItem key={q} value={q}><span style={{ color: qualityColor[q] }}>{q}</span></SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={faction} onValueChange={setFaction}>
          <SelectTrigger className="md:col-span-4 bg-secondary/40"><SelectValue placeholder="Faction" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Horde">Horde</SelectItem>
            <SelectItem value="Alliance">Alliance</SelectItem>
          </SelectContent>
        </Select>

        <Select value={realm} onValueChange={setRealm}>
          <SelectTrigger className="md:col-span-4 bg-secondary/40">
            <SelectValue placeholder="Realm" />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="NightSlayer">NightSlayer</SelectItem>
            <SelectItem value="BlackTemple">BlackTemple</SelectItem>
            <SelectItem value="Firemaw">Firemaw</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("md:col-span-4 bg-secondary/40 border-border", !range && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {range?.from ? (range.to ? `${format(range.from, "PP")} – ${format(range.to, "PP")}` : format(range.from, "PP")) : "Pick a date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}
