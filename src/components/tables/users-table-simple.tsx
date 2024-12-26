"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInitials } from "@/lib/user-utils";
import { api } from "@/trpc/react"; // Import the API for fetching users

export default function UsersSimpleTable() {
  const { data } = api.user.getUsers.useQuery({ limit: 5, page: 1 }); // Fetch users

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {data?.users.map(
          (
            user // Map through fetched users
          ) => (
            <div className="flex items-center gap-4" key={user.id}>
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage
                  src={user.image ?? "/default-avatar.png"}
                  alt="Avatar"
                />
                <AvatarFallback>{getInitials(user.name ?? "")}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {user.name ?? "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="ml-auto font-medium">+$0.00</div>{" "}
              {/* Placeholder for sales amount */}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
