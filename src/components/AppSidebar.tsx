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
    ariaLabel: "Top Stories",
  },
  {
    title: "Best Stories",
    url: "/best",
    icon: "📈",
    ariaLabel: "Best Stories",
  },
  {
    title: "Newest Stories",
    url: "/newest",
    icon: "🆕",
    ariaLabel: "Newest Stories",
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
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-lg font-semibold">Navigation</h2>
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
                      aria-label={item.ariaLabel}
                    >
                      <span aria-hidden="true">{item.icon}</span>
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
