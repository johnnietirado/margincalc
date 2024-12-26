import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </TooltipProvider>
  );
}
