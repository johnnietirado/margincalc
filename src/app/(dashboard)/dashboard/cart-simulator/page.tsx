"use client";

import { CartBuilder } from "@/components/cart/cart-builder";
import { FinancialAnalysis } from "@/components/cart/financial-analysis";
import { CartProvider } from "@/lib/contexts/cart-context";

export default function Index() {
  return (
    <CartProvider>
      <div className="grid grid-cols-5 gap-8">
        <CartBuilder />
        <FinancialAnalysis />
      </div>
    </CartProvider>
  );
}
