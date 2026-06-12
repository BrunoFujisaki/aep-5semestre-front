import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Command, List, Settings, Users } from "lucide-react";

export const AppSideBar = () => {
  const location = useLocation();

  console.log(location);
  const items = [
    { title: "Demandas", url: "/admin/dashboard", icon: List },
    { title: "Usuários", url: "/admin/users", icon: Users },
    { title: "Configurações", url: "/admin/settings", icon: Settings },
  ];
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center h-16 gap-3 px-8">
        <Command className="size-6" />
        <h1 className="text-lg font-bold">Observação</h1>
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
