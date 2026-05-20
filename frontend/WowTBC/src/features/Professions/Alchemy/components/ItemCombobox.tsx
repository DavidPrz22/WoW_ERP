import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useItemSearch } from "../hooks/queries/queries";
import { useDebounce } from "@/hooks/useDebounce";
import type { Group } from "../types";
import { IconImg } from "@/components/IconImg";

export function ItemCombobox({
  value,
  groupClass,
  onChange,
}: {
  value: string;
  groupClass: Group["searchGroup"];
  onChange: (name: string, id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  const { data: items, isFetching } = useItemSearch({ 
    searchTerm: 
    debouncedSearchTerm, 
    subclass: groupClass, 
    class: "Consumable" ,
    
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-8 w-full justify-between text-xs font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || "Select item..."}
          </span>
          <ChevronsUpDown className="h-3 w-3 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search item..." 
            className="h-9" 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isFetching ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                "No item found."
              )}
            </CommandEmpty>
            
            {items && items.length > 0 && (
              <CommandGroup heading="Results">
                {items
                  .map((e, idx) => (
                    <CommandItem
                      key={idx}
                      value={e.name}
                      onSelect={() => {
                        onChange(e.name, e.id_ingame);
                        setOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <IconImg src={e.icon} alt={e.name} className="h-5 w-5 mr-2" />
                      <span className="flex-1 truncate">{e.name}</span>
                      <Check
                        className={cn("h-4 w-4", value === e.name ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
