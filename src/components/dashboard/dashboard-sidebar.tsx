"use client";

import {
  Home,
  LogOutIcon,
  Package,
  Settings,
  ShoppingCart,
  Tag,
} from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sidebar";
import { OrganizationSwitcher, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Discounts",
    url: "/dashboard/discounts",
    icon: Tag,
  },
  {
    title: "Cart Simulator",
    url: "/dashboard/cart-simulator",
    icon: ShoppingCart,
  },
  // {
  //   title: "AI",
  //   url: "/dashboard/ai",
  //   icon: Sparkle,
  // },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <h3 className="text-lg font-bold pl-2 py-2">Margin Calculator</h3>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="bg-slate-200">
              <OrganizationSwitcher />
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/dashboard/settings"}>
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
            <LogOutIcon />
          </Button>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
