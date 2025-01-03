import { Doc } from "@/convex/_generated/dataModel";

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  sellingPrice: number;
  productionCost: number;
  priceId: string;
}

export interface UseCartSimulatorProps {
  products: Doc<"products">[];
  discounts: Doc<"discounts">[];
}

export interface AdditionalCost {
  id: string;
  name: string;
  type: "fixed" | "percentage";
  value: number;
  note?: string;
}

export interface CartSimulatorState {
  cart: CartItem[];
  shippingCost: number;
  freeShippingThreshold: number;
  offerFreeShipping: boolean;
  selectedProductId: string | null;
  selectedDiscountId: string | null;
  additionalCosts: AdditionalCost[];
}

export interface CartSimulatorCalculations {
  subtotal: number;
  discountedTotal: number;
  appliedShippingCost: number;
  totalRevenue: number;
  totalProductionCost: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  absorbedShippingCost: number;
  additionalCostsTotal: number;
}

export interface CartSimulatorActions {
  addToCart: (priceId: string) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  setShippingCost: (cost: number) => void;
  setFreeShippingThreshold: (threshold: number) => void;
  setOfferFreeShipping: (offer: boolean) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedDiscountId: (id: string | null) => void;
  addAdditionalCost: (cost: Omit<AdditionalCost, "id">) => void;
  removeAdditionalCost: (id: string) => void;
}
