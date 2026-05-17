import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRecordsStore } from "@/ZustandStores/useRecordsStore";
import { useFactionOptions, useRealmOptions } from "@/hooks/useQueryHooks";
import { useRecordsSelect } from "../hooks/useRecords";

export function RecordSelects() {
  const {
    dataFaction,
    dataRealm,
    dataRecordId,
    setDataFaction,
    setDataRealm,
    setDataRecordId,
  } = useRecordsStore();

  const { data: factions, isLoading: factionsLoading } = useFactionOptions();
  const { data: realms, isLoading: realmsLoading } = useRealmOptions();

  const { data: recordsData, isLoading: recordsLoading } = useRecordsSelect({
    realm: dataRealm,
    faction: dataFaction,
  });

  const factionList = factions || [];
  const realmList = realms || [];
  const records = recordsData?.results || [];

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Faction</Label>
        <Select value={dataFaction} onValueChange={setDataFaction} disabled={factionsLoading}>
          <SelectTrigger className="w-[180px] bg-secondary/40">
            <SelectValue placeholder={factionsLoading ? "Loading..." : "Select Faction"} />
          </SelectTrigger>
          <SelectContent>
            {factionList.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Realm</Label>
        <Select 
          value={dataRealm} 
          onValueChange={setDataRealm}
          disabled={!dataFaction || realmsLoading}
        >
          <SelectTrigger className="w-[180px] bg-secondary/40">
            <SelectValue placeholder={realmsLoading ? "Loading..." : "Select Realm"} />
          </SelectTrigger>
          <SelectContent>
            {realmList.map((r) => (
              <SelectItem key={r.realm_name} value={r.realm_name}>
                {r.realm_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Record</Label>
        <Select 
          value={dataRecordId} 
          onValueChange={setDataRecordId}
          disabled={!dataRealm || !dataFaction || recordsLoading}
        >
          <SelectTrigger className="w-[240px] bg-secondary/40">
            <SelectValue placeholder={recordsLoading ? "Loading..." : "Select Record"} />
          </SelectTrigger>
          <SelectContent>
            {records.map((r) => (
              <SelectItem key={r.id} value={r.id.toString()}>
                {r.id} - {new Date(r.timestamp).toLocaleString()} 
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
