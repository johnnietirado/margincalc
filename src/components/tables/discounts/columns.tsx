"use client";

import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { EditDiscountDialog } from "@/components/dialogs/edit-discount-dialog";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";

export type Discount = {
  _id: Id<"discounts">;
  name: string;
  type: "percentOff" | "amountOff" | "buyXGetY";
  value?: number;
  buyX?: number;
  getY?: number;
};

export const columns: ColumnDef<Discount>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <div className="capitalize">{type}</div>;
    },
  },
  {
    id: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const discount = row.original;
      if (discount.type === "buyXGetY") {
        return `Buy ${discount.buyX} Get ${discount.getY}`;
      }
      if (discount.type === "percentOff") {
        return `${discount.value}%`;
      }
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(discount.value ?? 0);
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const discount = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const deleteDiscount = useMutation(api.discounts.remove);

      return (
        <div className="flex items-center gap-2 justify-end">
          <EditDiscountDialog discount={discount} />
          <DeleteConfirmationDialog
            title="Delete Discount"
            description={`Are you sure you want to delete ${discount.name}? This action cannot be undone.`}
            onConfirm={async () => {
              deleteDiscount({ id: discount._id });
            }}
          />
        </div>
      );
    },
  },
];
