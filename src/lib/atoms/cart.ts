import { CartItem } from "@/lib/types/cart";
import { atomWithStorage } from "jotai/utils";

interface CartState {
  items: CartItem[];
  shippingCost: number;
  freeShippingThreshold: number;
  offerFreeShipping: boolean;
  selectedProductId: string | null;
  selectedDiscountId: string | null;
  additionalCosts: Array<{
    id: string;
    name: string;
    type: "fixed" | "percentage";
    value: number;
    note?: string;
  }>;
}

export const cartStateAtom = atomWithStorage<CartState>("cart:state", {
  items: [],
  shippingCost: 0,
  freeShippingThreshold: 0,
  offerFreeShipping: false,
  selectedProductId: null,
  selectedDiscountId: null,
  additionalCosts: [],
});
