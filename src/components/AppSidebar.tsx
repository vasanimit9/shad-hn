"use client";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";

const items = [
  {
    title: "Top Stories",
    url: "/",
    icon: "🔝",
  },
  {
    title: "Best Stories",
    url: "/best",
    icon: "📈",
  },
  {
    title: "Newest Stories",
    url: "/newest",
    icon: "🆕",
  },
];

export default function AppSidebar() {
  const sidebar = useSidebar();
  const pathname = usePathname();

  const [installPrompt, setInstallPrompt] = useState<any>();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    })
  }, []);

  const onInstallClicked = useCallback(async () => {
    if(!installPrompt) {
      return;
    }
    const result = await installPrompt.prompt();
    setInstallPrompt(null);
  }, [installPrompt]);

  return (
    <Sidebar collapsible="offcanvas" className="fixed">
      <SidebarHeader className="p-0">
        <div className="flex text-xl border-b-2 top-0 left-0 w-full bg-inherit md:hidden">
          <div className="flex max-w-screen-md p-3 md:px-0 w-full md:mx-auto">
            <div className="border border-gray-300 rounded mr-2">
              <SidebarTrigger />
            </div>
            ShadHN
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.url === pathname}>
                    <Link
                      className="text-inherit"
                      style={{ fontFamily: "Geist", fontSize: "16px" }}
                      href={item.url}
                      onClick={sidebar.isMobile ? sidebar.toggleSidebar : undefined}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {installPrompt && <SidebarFooter className="p-3 flex">
        <Button onClick={onInstallClicked}>Install</Button>
      </SidebarFooter>}
    </Sidebar>
  );
}
