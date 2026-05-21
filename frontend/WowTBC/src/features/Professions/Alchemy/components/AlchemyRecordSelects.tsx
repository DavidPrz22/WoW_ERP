import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAlchemyStore } from "@/ZustandStores/useAlchemyStore";
import { useFactionOptions, useRealmOptions } from "@/hooks/useQueryHooks";
import { useUserDataRecordDetails , useRecordsSelect} from "@/hooks/useQueryHooks";
import { useEffect } from "react";

export function AlchemyRecordSelects() {
  const {
    dataFaction,
    dataRealm,
    dataRecordId,
    setDataFaction,
    setDataRealm,
    setDataRecordId,
  } = useAlchemyStore();

  const { data: factions, isLoading: factionsLoading } = useFactionOptions();
  const { data: realms, isLoading: realmsLoading } = useRealmOptions();

  const { data: userDataRecordDetails } = useUserDataRecordDetails();

  useEffect(() => {
    if (userDataRecordDetails) {
      const { recordDetails } = userDataRecordDetails;
      setDataFaction(recordDetails.faction);
      setDataRealm(recordDetails.realm);
    }
  }, [userDataRecordDetails, setDataFaction, setDataRealm]);

  const { data: recordsData, isLoading: recordsLoading } = useRecordsSelect({
    realm: dataRealm,
    faction: dataFaction,
  });

  const factionList = factions || [];
  const realmList = realms || [];
  const records = recordsData?.results || [];

  return (
    <div className="flex flex-wrap gap-4 items-end bg-card/25 border border-border/40 p-4 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label className="text-xs text-gold/80 font-medium">Faction</Label>
        <Select value={dataFaction} onValueChange={setDataFaction} disabled={factionsLoading}>
          <SelectTrigger className="w-[180px] bg-secondary/40 border-border/60 text-gold focus:ring-1 focus:ring-gold/50">
            <SelectValue placeholder={factionsLoading ? "Loading..." : "Select Faction"} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border/80 text-foreground">
            {factionList.map((f) => (
              <SelectItem key={f} value={f} className="focus:bg-gold/10 focus:text-gold">
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-gold/80 font-medium">Realm</Label>
        <Select 
          value={dataRealm} 
          onValueChange={setDataRealm}
          disabled={!dataFaction || realmsLoading}
        >
          <SelectTrigger className="w-[180px] bg-secondary/40 border-border/60 text-gold focus:ring-1 focus:ring-gold/50">
            <SelectValue placeholder={realmsLoading ? "Loading..." : "Select Realm"} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border/80 text-foreground">
            {realmList.map((r) => (
              <SelectItem key={r.realm_name} value={r.realm_name} className="focus:bg-gold/10 focus:text-gold">
                {r.realm_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-gold/80 font-medium">Record</Label>
        <Select 
          value={dataRecordId} 
          onValueChange={setDataRecordId}
          disabled={!dataRealm || !dataFaction || recordsLoading}
        >
          <SelectTrigger className="w-[240px] bg-secondary/40 border-border/60 text-gold focus:ring-1 focus:ring-gold/50">
            <SelectValue placeholder={recordsLoading ? "Loading..." : "Select Record"} />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border/80 text-foreground">
            {records.map((r) => (
              <SelectItem key={r.id} value={r.id.toString()} className="focus:bg-gold/10 focus:text-gold">
                {r.id} - {new Date(r.timestamp).toLocaleString()} 
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
