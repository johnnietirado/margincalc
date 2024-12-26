"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { type Product } from "./types";

const columnHelper = createColumnHelper<Product>();

export const columns = [
  columnHelper.accessor("image", {
    header: "Image",
    cell: (info) => {
      const imageSrc = info.getValue() ?? "/placeholder.svg";
      return (
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height={64}
          src={imageSrc}
          width={64}
        />
      );
    },
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Badge variant={info.getValue() === "active" ? "outline" : "secondary"}>
        {info.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => `$${info.getValue().toFixed(2)}`,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => {
      const createdAt = info.getValue();
      const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A";
      return <span>{formattedDate}</span>;
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const isTest = env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY?.includes("test");
      let url = `https://dashboard.stripe.com/products/${row.original.id}`;
      if (isTest) {
        url = `https://dashboard.stripe.com/test/products/${row.original.id}`;
      }

      return (
        <div className="flex justify-end gap-2">
          <Button asChild variant="link">
            <Link href={url} target="_blank">
              Edit In Stripe
            </Link>
          </Button>
        </div>
      );
    },
  }),
];
