import { Link, useLocation } from "react-router-dom";
import { BarChart3, Command, List, Settings, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export const AppSideBar = () => {
  const location = useLocation();

  const items = [
    { title: "Relatorios", url: "/admin/reports", icon: BarChart3 },
    { title: "Demandas", url: "/admin/dashboard", icon: List },
    { title: "Usuarios", url: "/admin/users", icon: Users },
    { title: "Configuracoes", url: "/admin/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 flex-row items-center gap-3 px-8">
        <Command className="size-6" />
        <h1 className="text-lg font-bold">Observacao</h1>
      </SidebarHeader>
      <hr />
      <SidebarContent className="p-4">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link className="py-5 text-muted-foreground" to={item.url}>
                    <item.icon />
                    <span className="text-lg">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
