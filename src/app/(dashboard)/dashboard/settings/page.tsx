"use client";

import { ProfilePictureUpload } from "@/components/account/profile-picture-upload";
import { UpdateAccountDetailsForm } from "@/components/account/update-account-details-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="col-span-3 grid grid-cols-1 gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="col-span-3 grid grid-cols-1 gap-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <UpdateAccountDetailsForm />
      <ProfilePictureUpload />
    </div>
  );
}
