"use client";

import { CartBuilder } from "@/components/cart/cart-builder";
import { FinancialAnalysis } from "@/components/cart/financial-analysis";
import { CartProvider } from "@/lib/contexts/cart-context";

export default function Index() {
  return (
    <CartProvider>
      <div className="grid grid-cols-3 gap-12">
        <CartBuilder />
        <FinancialAnalysis />
      </div>
    </CartProvider>
  );
}
