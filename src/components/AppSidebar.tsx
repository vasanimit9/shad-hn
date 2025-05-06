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
                  <SidebarMenuButton asChild>
                    <Link
                      className="text-inherit"
                      style={{ fontFamily: "Geist", fontSize: "16px" }}
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
