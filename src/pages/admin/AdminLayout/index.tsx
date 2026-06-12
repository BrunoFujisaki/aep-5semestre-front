import { AppSideBar } from "@/components/AppSideBar";
import { Header } from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSideBar />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <SidebarTrigger />
            <Header />
          </div>
          <Outlet />
        </div>
      </SidebarProvider>
    </>
  );
};
