import { NavLink, useLocation } from "react-router-dom";
import { Home, Database, LineChart, ChevronDown, FlaskConical, Gem, Sparkles, Wrench, UtensilsCrossed, Package } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const main = [
  { title: "Home", url: "/", icon: Home },
  { title: "Records", url: "/records", icon: Database },
  { title: "Pricing History", url: "/pricing", icon: LineChart },
];

const professions = [
  { title: "Alchemy", url: "/professions/alchemy", icon: FlaskConical },
  { title: "Jewelcrafting", url: "/professions/Jewelcrafting", icon: Gem },
  { title: "Engineering", url: "/professions/engineering", icon: Wrench },
  { title: "Cooking", url: "/professions/cooking", icon: UtensilsCrossed },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const profExpanded = pathname.startsWith("/professions");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-gold shadow-gold flex items-center justify-center text-primary-foreground font-display font-bold">
            W
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base text-gold">WowTBC</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">ERP</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible defaultOpen={profExpanded} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Package className="h-4 w-4" />
                      <span>Professions</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {professions.map((p) => (
                        <SidebarMenuSubItem key={p.title}>
                          <SidebarMenuSubButton asChild isActive={pathname === p.url}>
                            <NavLink to={p.url}>
                              <p.icon className="h-3.5 w-3.5" />
                              <span>{p.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}