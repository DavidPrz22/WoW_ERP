import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Controller, type Control } from "react-hook-form";
import { useFactionOptions, useRealmOptions } from "../hooks/queries/queries";

interface HistoryFiltersProps {
  control: Control<any>;
}

export function HistoryFilters({ control }: HistoryFiltersProps) {
  const { data: factions = [] } = useFactionOptions();
  const { data: realms = [] } = useRealmOptions();

  return (
    <Card className="bg-card/60 border-border shadow-panel">
      <CardContent className="p-5">
        <div className="grid gap-4 md:grid-cols-12">
          <Controller
            name="faction_id"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <SelectTrigger className="md:col-span-4 bg-secondary/40"><SelectValue placeholder="Faction" /></SelectTrigger>
                <SelectContent>
                  {factions.map((f: string) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="realm_id"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value?.toString()} 
                onValueChange={(v) => {
                  field.onChange(parseInt(v));
                }}
              >
                <SelectTrigger className="md:col-span-4 bg-secondary/40">
                  <SelectValue placeholder="Realm"/>
                </SelectTrigger>
                <SelectContent>
                  {realms.map((r: { realm_id: number, realm_name: string }) => (
                    <SelectItem key={r.realm_id} value={r.realm_id.toString()}>{r.realm_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          
          <Controller
            name="range"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("md:col-span-4 bg-secondary/40 border-border", !field.value && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value.to ? (
                        `${format(field.value.from, "PP")} – ${format(field.value.to, "PP")}`
                      ) : (
                        format(field.value.from, "PP")
                      )
                    ) : (
                      "Pick a date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                    mode="range" 
                    selected={field.value} 
                    onSelect={(val) => {
                      field.onChange(val);
                    }} 
                    numberOfMonths={2}
                    className={cn("p-3 pointer-events-auto")} 
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
