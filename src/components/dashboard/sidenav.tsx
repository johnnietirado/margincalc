"use client";

import {
  Home,
  Package,
  Package2,
  Settings,
  Sparkles,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const sidenavItems = [
  { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "#" },

  {
    icon: <Package className="h-5 w-5" />,
    label: "Products",
    href: "products",
  },
  {
    icon: <Users2 className="h-5 w-5" />,
    label: "Users",
    href: "users",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    label: "AI",
    href: "ai",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
    href: "settings",
  },
];

export default function Sidenav() {
  const pathname = usePathname(); // Get the current pathname

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">Your Company</span>
        </Link>
        {sidenavItems
          .filter((item) => item.label !== "Settings")
          .map(({ icon, label, href }, index) => {
            const isActive =
              href === "#"
                ? pathname === `/dashboard` // Exact match for Dashboard
                : pathname.startsWith(`/dashboard/${href}`); // Prefix match for others
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={`/dashboard/${href ?? ""}`}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                      isActive ? "bg-accent text-accent-foreground" : ""
                    )}
                  >
                    {icon}
                    <span className="sr-only">{label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          })}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/dashboard/${
                sidenavItems[sidenavItems.length - 1]?.href ?? "#"
              }`}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              {sidenavItems[sidenavItems.length - 1]?.icon ?? (
                <Home className="h-5 w-5" />
              )}{" "}
              <span className="sr-only">
                {sidenavItems[sidenavItems.length - 1]?.label ??
                  "Default Label"}
              </span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {sidenavItems[sidenavItems.length - 1]?.label ?? "Default Label"}
          </TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
