import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClipboardCopy, Edit2, MoreHorizontal, PlusCircle } from "lucide-react";
import type Stripe from "stripe";

export default function ProductDetails({
  product,
}: {
  product: Stripe.Product;
}) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Extract product details for better readability
  const {
    name,
    active,
    created,
    updated,
    id,
    tax_code,
    marketing_features,
    description,
    statement_descriptor,
  } = product;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{name}</h1>
        <div className="flex items-center space-x-2">
          <Button variant="default">Edit product</Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <Badge variant={active ? "default" : "secondary"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">$10.00 USD</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-xl font-semibold">
              Pricing
              <Button variant="outline" size="icon">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>$10.00 USD</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>{formatDate(product.created)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">MRR</p>
              <p>$0.00</p>
              <p className="text-sm text-gray-500">
                As of {formatDate(product.updated)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-semibold">
            Details
            <Button variant="outline" size="icon">
              <Edit2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Product ID</p>
              <div className="flex items-center space-x-2">
                <p>{id}</p>
                <Button variant="outline" size="icon">
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="font-semibold">Product tax code</p>
              <p>{tax_code?.toString() ?? "None"}</p>
            </div>
            <div>
              <p className="font-semibold">Marketing feature list</p>
              {marketing_features.map((feature, index) => (
                <p key={index}>{feature.name}</p>
              ))}
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p>{description}</p>
            </div>
            <div>
              <p className="font-semibold">Statement descriptor</p>
              <p>{statement_descriptor ?? "—"}</p>
            </div>
            <div>
              <p className="font-semibold">Created</p>
              <p>{formatDate(created)}</p>
            </div>
            <div>
              <p className="font-semibold">Updated</p>
              <p>{formatDate(updated)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
