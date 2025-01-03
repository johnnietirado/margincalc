"use client";

import { CreateProductDialog } from "@/components/dialogs/create-product-dialog";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/products/columns";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function ProductsPage() {
  const products = useQuery(api.products.get) ?? [];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <CreateProductDialog />
      </div>
      <DataTable columns={columns} data={products} />
    </>
  );
}
