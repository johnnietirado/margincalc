"use client";

import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { EditProductDialog } from "@/components/dialogs/edit-product-dialog";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation } from "convex/react";

export type Product = {
  _id: Id<"products">;
  name: string;
  prices: Array<{
    id: string;
    alias: string;
    value: number;
  }>;
  productionCost: number;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "prices",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prices" />
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const prices = row.getValue("prices") as Product["prices"];
      const productionCost = row.original.productionCost;

      const calculateProfitMargin = (price: number, productionCost: number) => {
        const profit = price - productionCost;
        return ((profit / price) * 100).toFixed(2);
      };

      return (
        <div className="space-y-2">
          {prices.map((price) => (
            <div key={price.id} className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground w-24">
                {price.alias}:
              </div>
              <div className="w-24">${price.value.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">
                ({calculateProfitMargin(price.value, productionCost)}% margin)
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "productionCost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Production Cost" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("productionCost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const deleteProduct = useMutation(api.products.remove);

      return (
        <div className="flex items-center gap-2">
          <EditProductDialog product={product} />
          <DeleteConfirmationDialog
            title="Delete Product"
            description={`Are you sure you want to delete ${product.name}? This action cannot be undone.`}
            onConfirm={() => deleteProduct({ id: product._id })}
          />
        </div>
      );
    },
  },
];
