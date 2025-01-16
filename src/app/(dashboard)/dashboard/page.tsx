"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();
  return (
    <>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Welcome {user?.firstName} 👋</CardTitle>
              <CardDescription className="leading-relaxed">
                This application is designed to help you calculate the margin of
                your products. You can add products, create discounts, and
                calculate the true margin of each order.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button>View Documentation</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
