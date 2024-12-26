"use client";

import { columns } from "@/components/tables/users-table/columns";
import { DataTable } from "@/components/tables/users-table/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react"; // Import the API for fetching users

export default function UsersTable() {
  const { data } = api.user.getUsers.useQuery({ limit: 5, page: 1 }); // Fetch users

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="text-2xl">Users</CardTitle>
        <CardDescription>Manage your users</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <DataTable
          columns={columns}
          data={data?.users ?? []}
          totalCount={data?.totalCount ?? 0}
        />
      </CardContent>
    </Card>
  );
}
