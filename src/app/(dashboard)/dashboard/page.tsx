import { DashboardGuide } from "@/components/dashboard/dashboard-guide";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Your Dashboard</CardTitle>
              <CardDescription className="leading-relaxed">
                Welcome to your dashboard. This is a blank canvas for your
                application. We recommend adding some widgets to your dashboard
                to help you manage your application.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>View Documentation</Button>
            </CardFooter>
          </Card>
        </div>
        <DashboardGuide />
      </div>
    </>
  );
}
