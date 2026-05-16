import { useState } from "react";
import { toast } from "sonner";
import { TableProperties, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SystemPriceTable } from "./SystemPriceTable";
import { useRecordsStore } from "@/ZustandStores/useRecordsStore";
import { useRecords } from "../hooks/useRecords";
import { useGenerateRecordMutation } from "../hooks/mutations/useGenerateRecord";

export function SystemRecordsHeader() {
  const { recordsQuery, faction, showPrices, setRecordsQuery, setFaction, setShowPrices } = useRecordsStore();

  const [page, setPage] = useState(1);
  const { data, isLoading } = useRecords({
    page: page,
  });

  const rawRecords = data?.results || [];
  const records = rawRecords.filter((r) => {
    const matchesFaction = faction === "all" || r.faction === faction;
    const matchesSearch = !recordsQuery || r.realm_name.toLowerCase().includes(recordsQuery.toLowerCase()) || r.id.toString().includes(recordsQuery);
    return matchesFaction && matchesSearch;
  });

  const { mutate: generateRecord, isPending: generating } = useGenerateRecordMutation();

  const handleGenerate = () => {
    toast.info("Snapshot triggered", { description: "Fetching latest data from TSM API…" });
    generateRecord();
  };

  if (showPrices) {
    return <SystemPriceTable />;
  }

  return (
    <div className="px-6 md:px-12 py-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-gold">Records</h1>
          <p className="text-muted-foreground text-sm">Browse and generate auction house ingestion snapshots.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary/40" onClick={() => setShowPrices(true)}>
            <TableProperties className="mr-2 h-4 w-4" /> Price Table
          </Button>
          <Button onClick={handleGenerate} disabled={generating} className="bg-gradient-gold text-primary-foreground shadow-gold">
            <RefreshCw className={`mr-2 h-4 w-4 ${generating ? "animate-spin" : ""}`} />
            Generate Record
          </Button>
        </div>
      </div>

      <Card className="bg-card/60 border-border shadow-panel">
        <CardHeader className="flex flex-row flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={recordsQuery}
              onChange={(e) => setRecordsQuery(e.target.value)}
              placeholder="Search by realm or record id…"
              className="pl-9 bg-secondary/40"
            />
          </div>
          <Select value={faction} onValueChange={setFaction}>
            <SelectTrigger className="w-[180px] bg-secondary/40">
              <SelectValue placeholder="Faction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All factions</SelectItem>
              <SelectItem value="Horde">Horde</SelectItem>
              <SelectItem value="Alliance">Alliance</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Record ID</TableHead>
                <TableHead>Realm</TableHead>
                <TableHead>Faction</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Loading records...
                  </TableCell>
                </TableRow>
              ) : records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.realm_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={r.faction === "Horde" ? "border-[hsl(var(--faction-horde))] text-[hsl(var(--faction-horde))]" : "border-[hsl(var(--faction-alliance))] text-[hsl(var(--faction-alliance))]"}>
                      {r.faction}
                    </Badge>
                  </TableCell>
                  <TableCell>{r.item_count?.toLocaleString() || 0}</TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {new Date(r.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && records.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-between mt-4">
            <Button 
              variant="outline" 
              disabled={!data?.previous} 
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button 
              variant="outline" 
              disabled={!data?.next} 
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}