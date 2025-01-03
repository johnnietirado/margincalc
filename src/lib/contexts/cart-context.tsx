import { api } from "@/convex/_generated/api";
import { useCartSimulator } from "@/lib/hooks/useCartSimulator";
import {
  AdditionalCost,
  CartItem,
  CartSimulatorActions,
  CartSimulatorCalculations,
} from "@/lib/types/cart";
import { useQuery } from "convex/react";
import { createContext, ReactNode, useContext } from "react";

type CartContextType = {
  cart: CartItem[];
  shippingCost: number;
  freeShippingThreshold: number;
  offerFreeShipping: boolean;
  selectedProductId: string | null;
  selectedDiscountId: string | null;
  additionalCosts: AdditionalCost[];
  setShippingCost: (cost: number) => void;
  setFreeShippingThreshold: (threshold: number) => void;
  setOfferFreeShipping: (offer: boolean) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedDiscountId: (id: string | null) => void;
} & CartSimulatorCalculations &
  CartSimulatorActions;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const products = useQuery(api.products.get) ?? [];
  const discounts = useQuery(api.discounts.get) ?? [];
  const cartState = useCartSimulator({ products, discounts });

  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
