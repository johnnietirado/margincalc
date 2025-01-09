"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile, useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="col-span-3 grid grid-cols-1 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="col-span-3 grid grid-cols-1 gap-4">
      <UserProfile />
    </div>
  );
}
