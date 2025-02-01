"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cartStateAtom } from "@/lib/atoms/cart";
import { useSetAtom } from "jotai";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const setCartState = useSetAtom(cartStateAtom);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleReset = () => {
    setCartState({
      items: [],
      shippingCost: 0,
      freeShippingThreshold: 0,
      offerFreeShipping: false,
      selectedProductId: null,
      selectedDiscountId: null,
      additionalCosts: [],
    });
    reset();
  };

  return (
    <div className="flex h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground">
              Don&apos;t worry! We can fix this by refreshing the page and
              resetting your cart.
            </p>
          </div>
          <Button size="lg" onClick={handleReset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset and try again
          </Button>
        </div>
      </Card>
    </div>
  );
}
