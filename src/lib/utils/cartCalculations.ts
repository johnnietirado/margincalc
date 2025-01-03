import { Doc } from "@/convex/_generated/dataModel";
import { CartItem } from "../types/cart";

export function calculateSubtotal(cart: CartItem[]): number {
  return cart.reduce(
    (total, item) => total + item.sellingPrice * item.quantity,
    0
  );
}

export function calculateTotalProductionCost(cart: CartItem[]): number {
  return cart.reduce(
    (total, item) => total + item.productionCost * item.quantity,
    0
  );
}

export function applyDiscount(
  subtotal: number,
  cart: CartItem[],
  selectedDiscountId: string | null,
  discounts: Doc<"discounts">[]
): number {
  const discount = discounts.find((d) => d._id === selectedDiscountId);
  if (!discount) return subtotal;

  switch (discount.type) {
    case "percentOff":
      return subtotal * (1 - discount.value / 100);
    case "amountOff":
      return Math.max(0, subtotal - discount.value);
    case "buyXGetY": {
      if (discount.buyX && discount.getY) {
        const totalQuantity = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );
        const freeItems =
          Math.floor(totalQuantity / (discount.buyX + discount.getY)) *
          discount.getY;
        const averagePrice = subtotal / totalQuantity;
        return subtotal - averagePrice * freeItems;
      }
      return subtotal;
    }
    default:
      return subtotal;
  }
}

export function calculateShippingCost(
  discountedTotal: number,
  offerFreeShipping: boolean,
  freeShippingThreshold: number,
  shippingCost: number
): number {
  if (offerFreeShipping && discountedTotal >= freeShippingThreshold) {
    return 0;
  }
  return shippingCost;
}

export function calculateAbsorbedShippingCost(
  discountedTotal: number,
  offerFreeShipping: boolean,
  freeShippingThreshold: number,
  shippingCost: number
): number {
  return offerFreeShipping && discountedTotal >= freeShippingThreshold
    ? shippingCost
    : 0;
}

export const calculateProfitMargin = (
  price: number,
  productionCost: number
) => {
  const profit = price - productionCost;
  return ((profit / price) * 100).toFixed(2);
};
