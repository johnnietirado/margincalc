"use client";

import ProductsTableSkeleton from "@/components/tables/products-table/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { columns } from "./columns";

export function ProductsTable() {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    api.stripe.getProducts.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage: { nextCursor?: string }) =>
          lastPage.nextCursor,
      }
    );

  const products = (data?.pages ?? []).flatMap((page) => page.products) ?? [];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return <div>Error loading products</div>;
  }

  const hasProducts = products.length > 0;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="text-2xl">Products</CardTitle>
        <CardDescription>Manage your Stripe products</CardDescription>
        <Button asChild className="absolute right-6 top-4 hidden md:block">
          <Link href="/dashboard/products/create">Create Product</Link>
        </Button>
      </CardHeader>
      {isLoading ? (
        <ProductsTableSkeleton />
      ) : hasProducts ? (
        <>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing <strong>{products.length}</strong> products
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage}
            >
              Load More
            </Button>
          </CardFooter>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <p className="text-lg font-semibold">No products found</p>
          <p className="text-sm text-muted-foreground">
            Try adding some products to get started.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/products/create">Create Product</Link>
          </Button>
        </div>
      )}
    </Card>
  );
}
