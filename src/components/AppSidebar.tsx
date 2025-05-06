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
  useSidebar,
} from "./ui/sidebar";

const items = [
  {
    title: "Top Stories",
    url: "/",
    icon: '🔝',
  },
  {
    title: "Best Stories",
    url: "/best",
    icon: '📈',
  },
  {
    title: "Newest Stories",
    url: "/newest",
    icon: '🆕',
  },
];



export default function AppSidebar() {
  const sidebar = useSidebar();
  return (
    <Sidebar collapsible="offcanvas" className="fixed">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      className="text-sm"
                      style={{ fontFamily: "Geist" }}
                      href={item.url}
                      onClick={sidebar.toggleSidebar}
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
      <SidebarFooter />
    </Sidebar>
  );
}
