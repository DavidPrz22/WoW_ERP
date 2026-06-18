import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Search,
  ExternalLink,
  Server,
  Database,
  FlaskConical,
  Gem,
  Wrench,
  UtensilsCrossed,
  PackageIcon,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const tagIcons: Record<string, React.ElementType> = {
  Registros: Database,
  Alchemy: FlaskConical,
  Jewelcrafting: Gem,
  Engineering: Wrench,
  Cooking: UtensilsCrossed,
  Boe: PackageIcon,
};

const methodColors: Record<string, string> = {
  get: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  post: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  put: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  patch: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  delete: "bg-red-500/10 text-red-400 border-red-500/30",
};

interface ParamInfo {
  name: string;
  in: string;
  required: boolean;
  description: string;
  schema: { type: string };
}

interface EndpointInfo {
  path: string;
  method: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: ParamInfo[];
  requestBody?: { description: string; content: any };
  responses: Record<string, { description: string; content?: any }>;
}

interface SchemaInfo {
  name: string;
  type: string;
  properties: Record<string, { type: string; description?: string }>;
  required?: string[];
}

export default function APIDocs() {
  const { toast } = useToast();
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/schema/`)
      .then((r) => r.json())
      .then((data) => {
        setSchema(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const endpoints: EndpointInfo[] = [];
  const schemas: SchemaInfo[] = [];

  if (schema?.paths) {
    Object.entries(schema.paths).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, details]: [string, any]) => {
        if (["get", "post", "put", "patch", "delete"].includes(method)) {
          endpoints.push({
            path,
            method,
            summary: details.summary || "",
            description: details.description || "",
            tags: details.tags || [],
            parameters: details.parameters || [],
            requestBody: details.requestBody,
            responses: details.responses || {},
          });
        }
      });
    });
  }

  if (schema?.components?.schemas) {
    Object.entries(schema.components.schemas).forEach(([name, def]: [string, any]) => {
      schemas.push({
        name,
        type: def.type || "object",
        properties: def.properties || {},
        required: def.required || [],
      });
    });
  }

  const tags = schema?.tags?.map((t: any) => t.name) || [];
  const filteredEndpoints = endpoints.filter((ep) => {
    const matchSearch =
      search === "" ||
      ep.summary.toLowerCase().includes(search.toLowerCase()) ||
      ep.path.toLowerCase().includes(search.toLowerCase()) ||
      ep.description.toLowerCase().includes(search.toLowerCase());
    const matchTag = selectedTag === "all" || ep.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const groupedByTag: Record<string, EndpointInfo[]> = {};
  filteredEndpoints.forEach((ep) => {
    const tag = ep.tags[0] || "Other";
    if (!groupedByTag[tag]) groupedByTag[tag] = [];
    groupedByTag[tag].push(ep);
  });

  const renderType = (type: string) => {
    if (type === "string") return "text-sky-400";
    if (type === "integer" || type === "number") return "text-amber-400";
    if (type === "boolean") return "text-purple-400";
    if (type === "array") return "text-emerald-400";
    if (type === "object") return "text-pink-400";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="text-center py-20 space-y-4">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
        <h2 className="font-display text-xl text-gold">Failed to load API schema</h2>
        <p className="text-muted-foreground">Make sure the backend server is running.</p>
        <Button asChild>
          <a href={`${API_BASE}/api/docs/`} target="_blank" rel="noopener noreferrer">
            Open Swagger UI <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl text-gold">API Documentation</h1>
          <p className="text-muted-foreground mt-1">
            {schema.info?.title} &middot; v{schema.info?.version}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={`${API_BASE}/api/docs/`} target="_blank" rel="noopener noreferrer">
              Swagger UI <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={`${API_BASE}/api/redoc/`} target="_blank" rel="noopener noreferrer">
              ReDoc <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {schema.info?.description && (
        <Card className="bg-card/60 border-border shadow-panel">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">{schema.info.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag("all")}
          >
            All ({endpoints.length})
          </Badge>
          {tags.map((tag: string) => {
            const count = endpoints.filter((ep) => ep.tags.includes(tag)).length;
            return (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(tag)}
              >
                {tag} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="endpoints">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="schemas">Schemas ({schemas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-4">
          {Object.entries(groupedByTag).map(([tag, eps]) => {
            const Icon = tagIcons[tag] || Server;
            return (
              <Card key={tag} className="bg-card/60 border-border shadow-panel">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-lg text-gold flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {tag}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Accordion type="multiple" className="space-y-2">
                    {eps.map((ep, idx) => {
                      const methodKey = ep.method.toLowerCase();
                      const fullPath = `${API_BASE}${ep.path}`;
                      return (
                        <AccordionItem key={idx} value={`${tag}-${idx}`} className="border-border/50">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 w-full">
                              <Badge
                                variant="outline"
                                className={`uppercase text-xs font-mono ${methodColors[methodKey] || ""}`}
                              >
                                {methodKey}
                              </Badge>
                              <code className="text-sm text-muted-foreground truncate">
                                {ep.path}
                              </code>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-2">
                            <div>
                              <h4 className="font-semibold text-sm text-foreground mb-1">{ep.summary}</h4>
                              <p className="text-sm text-muted-foreground">{ep.description}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                                {fullPath}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => copyToClipboard(fullPath, `url-${idx}`)}
                              >
                                {copied === `url-${idx}` ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </div>

                            {ep.parameters.length > 0 && (
                              <div>
                                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                  Parameters
                                </h5>
                                <div className="rounded-md border border-border/50 overflow-hidden">
                                  <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                      <tr>
                                        <th className="text-left px-3 py-2 font-medium">Name</th>
                                        <th className="text-left px-3 py-2 font-medium">In</th>
                                        <th className="text-left px-3 py-2 font-medium">Type</th>
                                        <th className="text-left px-3 py-2 font-medium">Required</th>
                                        <th className="text-left px-3 py-2 font-medium">Description</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ep.parameters.map((p, pIdx) => (
                                        <tr key={pIdx} className="border-t border-border/30">
                                          <td className="px-3 py-2 font-mono text-xs">{p.name}</td>
                                          <td className="px-3 py-2">
                                            <Badge variant="outline" className="text-xs">
                                              {p.in}
                                            </Badge>
                                          </td>
                                          <td className={`px-3 py-2 text-xs ${renderType(p.schema?.type)}`}>
                                            {p.schema?.type}
                                          </td>
                                          <td className="px-3 py-2">
                                            {p.required ? (
                                              <Badge variant="destructive" className="text-xs">Required</Badge>
                                            ) : (
                                              <span className="text-muted-foreground text-xs">Optional</span>
                                            )}
                                          </td>
                                          <td className="px-3 py-2 text-muted-foreground text-xs">{p.description}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {ep.requestBody && (
                              <div>
                                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                  Request Body
                                </h5>
                                <div className="rounded-md border border-border/50 bg-muted/30 p-3">
                                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                                    {JSON.stringify(
                                      ep.requestBody.content?.["application/json"]?.schema || {},
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              </div>
                            )}

                            {Object.keys(ep.responses).length > 0 && (
                              <div>
                                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                  Responses
                                </h5>
                                <div className="space-y-2">
                                  {Object.entries(ep.responses).map(([code, resp]: [string, any]) => (
                                    <div key={code} className="flex items-start gap-2 text-sm">
                                      <Badge
                                        variant={code.startsWith("2") ? "default" : code.startsWith("4") ? "destructive" : "outline"}
                                        className="font-mono text-xs min-w-[3rem] justify-center"
                                      >
                                        {code}
                                      </Badge>
                                      <span className="text-muted-foreground">{resp.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}

          {filteredEndpoints.length === 0 && (
            <Card className="bg-card/60 border-border shadow-panel">
              <CardContent className="py-12 text-center">
                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No endpoints match your search.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schemas" className="space-y-4">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-3">
              {schemas.map((s) => (
                <Card key={s.name} className="bg-card/60 border-border shadow-panel">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-sm text-gold flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      {s.name}
                      <Badge variant="outline" className="text-xs font-mono">
                        {s.type}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {Object.keys(s.properties).length > 0 ? (
                      <div className="rounded-md border border-border/50 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left px-3 py-2 font-medium">Property</th>
                              <th className="text-left px-3 py-2 font-medium">Type</th>
                              <th className="text-left px-3 py-2 font-medium">Required</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(s.properties).map(([prop, def]) => (
                              <tr key={prop} className="border-t border-border/30">
                                <td className="px-3 py-2 font-mono text-xs">{prop}</td>
                                <td className={`px-3 py-2 text-xs ${renderType(def.type)}`}>{def.type}</td>
                                <td className="px-3 py-2">
                                  {s.required?.includes(prop) ? (
                                    <Badge variant="destructive" className="text-xs">Required</Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">Optional</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No properties defined.</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
