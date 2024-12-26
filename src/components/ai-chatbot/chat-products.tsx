"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createCheckoutSession } from "@/server/actions/create-checkout-session";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  defaultPriceId: string;
  unitAmount: number | null;
  features: string[];
}

interface ChatProductsProps {
  products: Product[];
}

const ProductCard = ({ product }: { product: Product }) => {
  const [isPending, startTransition] = useTransition();
  const handlePurchase = async (priceId: string) => {
    startTransition(async () => {
      try {
        const { url } = await createCheckoutSession(priceId);
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    });
  };

  return (
    <Card key={product.id} className="flex flex-col">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="list-inside list-disc space-y-1">
          {product.features.map((feature, index) => (
            <li key={index} className="text-sm">
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => handlePurchase(product.defaultPriceId)}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            `Purchase ${
              product.unitAmount
                ? `($${(product.unitAmount / 100).toFixed(2)})`
                : ""
            }`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export function ChatProducts({ products }: ChatProductsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">Our Products</div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
