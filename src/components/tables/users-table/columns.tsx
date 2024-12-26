import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type UserGetOutput } from "@/server/api/root";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const columns: ColumnDef<UserGetOutput["users"][number]>[] = [
  {
    accessorKey: "name",
    enableHiding: false,
    header: () => <div className="ml-14 text-left">Name</div>,
    cell: ({ row }) => {
      console.log(row.original);
      return (
        <div className="flex items-center gap-2">
          <Avatar className="mr-2 border dark:border-white">
            <AvatarImage
              src={row.original.imageUrl ?? ""}
              alt="User Avatar"
              className=""
            />
            <AvatarFallback>
              {row.original.name?.charAt(0).toUpperCase() ?? ""}
            </AvatarFallback>
          </Avatar>
          <span>{row.original.name ?? ""}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
  },
  {
    accessorKey: "clerkId",
    header: "Clerk Id",
  },
  {
    accessorKey: "stripeCustomerId",
    header: "Stripe Customer Id",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="mx-auto h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={async () => {
                await navigator.clipboard.writeText(id);
                toast.success("User Id copied to clipboard");
              }}
            >
              Copy User Id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`users/${id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
