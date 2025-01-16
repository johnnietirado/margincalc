"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useConvexAuth } from "convex/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useConvexAuth();
  if (isLoading) {
    return <DashboardLoading />;
  }
  return (
    <TooltipProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </TooltipProvider>
  );
}
