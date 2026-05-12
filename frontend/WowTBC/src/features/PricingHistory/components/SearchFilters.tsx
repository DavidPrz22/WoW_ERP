import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconImg } from "@/components/IconImg";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, type Control, useWatch } from "react-hook-form";
import { useClassSubclass, useQualityOptions } from "../hooks/queries/queries";
import type { TPricingSearchValues } from "../schemas";
import { qualityColor } from "@/data/ItemsColors";

interface SearchFiltersProps {
  control: Control<TPricingSearchValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  open: boolean;
  setOpen: (o: boolean) => void;
  suggestions: any[];
  onSelect: (item: any) => void;
  setSubclass: (value: string) => void;
}

export function SearchFilters({
  control,
  onSubmit,
  open,
  setOpen,
  suggestions,
  onSelect,
  setSubclass
}: SearchFiltersProps) {
  const { data: classData = [] } = useClassSubclass();
  const { data: qualities = [] } = useQualityOptions();
  
  const [selectedClass, setSelectedClass] = useState("all");
  const selectedClassObj = classData.find((c: any) => c.name === selectedClass);
  const subOptions = selectedClassObj ? selectedClassObj.subclasses : [];

  const classVal = useWatch({ control, name: "class" });
  const qualityVal = useWatch({ control, name: "quality" });
  const searchTerm = useWatch({ control, name: "searchTerm" });

  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      setOpen(true);
    }
  }, [classVal, qualityVal, searchTerm, setOpen]);

  return (
    <Card className="bg-card/60 border-border shadow-panel">
      <CardContent className="p-5">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="relative md:col-span-12">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Controller
              name="searchTerm"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Search items…"
                  {...field}
                  onFocus={() => setOpen(true)}
                  onChange={(e) => {
                    field.onChange(e);
                  
                  }}
                  onBlur={() => setTimeout(() => setOpen(false), 150)}
                  className="pl-9 bg-secondary/40"
                />
              )}
            />
            {open && suggestions.length > 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-md border border-border bg-popover shadow-panel max-h-72 overflow-auto">
                {suggestions.map((i) => (
                  <button
                    key={i.id}
                    type="button"
                    onMouseDown={() => {
                      onSelect(i);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent/30 transition-colors text-[${qualityColor[i.quality]}]`}
                  >
                    <IconImg src={`/icons/${i.icon}`} alt={i.name} className="size-8 rounded-lg" />
                    <span className="text-sm font-medium">{i.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{i.itemClass || i.subclass}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Controller
            name="class"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(v) => { 
                  field.onChange(v); 
                  setSelectedClass(v); 
                  setSubclass("all");
                  onSubmit();
                }}
              >
                <SelectTrigger className="md:col-span-4 bg-secondary/40"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All classes</SelectItem>
                  {classData.map((c: any) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="subclass"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(v) => {
                  field.onChange(v);
                  onSubmit();
                }} 
                disabled={!selectedClass || selectedClass === "all"}
              >
                <SelectTrigger className="md:col-span-4 bg-secondary/40"><SelectValue placeholder="Subclass" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subclasses</SelectItem>
                  {subOptions.map((s: any) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="quality"
            control={control}
            render={({ field }) => (
              <Select 
                value={field.value} 
                onValueChange={(v) => {
                  field.onChange(v);
                  onSubmit();
                }}
              >
                <SelectTrigger className="md:col-span-4 bg-secondary/40"><SelectValue placeholder="Quality" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All qualities</SelectItem>
                  {qualities.map((q: string) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
