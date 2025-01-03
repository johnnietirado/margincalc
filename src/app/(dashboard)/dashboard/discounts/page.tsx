"use client";

import { CreateDiscountDialog } from "@/components/dialogs/create-discount-dialog";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "@/components/tables/discounts/columns";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function DiscountsPage() {
  const discounts = useQuery(api.discounts.get) ?? [];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Discounts</h1>
        <CreateDiscountDialog />
      </div>
      <DataTable columns={columns} data={discounts} />
    </>
  );
}
