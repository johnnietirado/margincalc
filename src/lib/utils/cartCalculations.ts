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
      return subtotal * (1 - (discount.value ?? 0) / 100);
    case "amountOff":
      return Math.max(0, subtotal - (discount.value ?? 0));
    case "buyXGetY": {
      if (discount.buyX && discount.getY) {
        // Sort items by price (cheapest first) and expand them by quantity
        const expandedItems = cart
          .flatMap((item) =>
            Array(item.quantity).fill({
              sellingPrice: item.sellingPrice,
            })
          )
          .sort((a, b) => a.sellingPrice - b.sellingPrice);

        const totalQuantity = expandedItems.length;
        const groupSize = discount.buyX + discount.getY;
        const numGroups = Math.floor(totalQuantity / groupSize);

        // Calculate total discount by taking the cheapest items as free items
        let totalDiscount = 0;
        for (let i = 0; i < numGroups; i++) {
          // For each group, take the last Y items (which will be the cheapest due to sorting)
          const startIdx = i * groupSize + discount.buyX;
          const endIdx = startIdx + discount.getY;
          for (let j = startIdx; j < endIdx; j++) {
            totalDiscount += expandedItems[j].sellingPrice;
          }
        }

        return subtotal - totalDiscount;
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
