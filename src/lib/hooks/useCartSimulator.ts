import { cartStateAtom } from "@/lib/atoms/cart";
import {
  CartSimulatorActions,
  CartSimulatorCalculations,
  CartSimulatorState,
  UseCartSimulatorProps,
} from "@/lib/types/cart";
import {
  applyDiscount,
  calculateAbsorbedShippingCost,
  calculateShippingCost,
  calculateSubtotal,
  calculateTotalProductionCost,
} from "@/lib/utils/cartCalculations";
import { useAtom } from "jotai";

export function useCartSimulator({
  products,
  discounts,
}: UseCartSimulatorProps): CartSimulatorState &
  CartSimulatorCalculations &
  CartSimulatorActions {
  const [cartState, setCartState] = useAtom(cartStateAtom);

  const addToCart = (priceId: string) => {
    const product = products.find((p) => p._id === cartState.selectedProductId);
    if (product) {
      const price = product.prices.find((p) => p.id === priceId);
      if (!price) return;

      const existingItem = cartState.items.find(
        (item) => item.id === product._id && item.priceId === priceId
      );

      if (existingItem) {
        setCartState({
          ...cartState,
          items: cartState.items.map((item) =>
            item.id === product._id && item.priceId === priceId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        });
      } else {
        setCartState({
          ...cartState,
          items: [
            ...cartState.items,
            {
              id: product._id,
              name: product.name,
              priceId: price.id,
              sellingPrice: price.value,
              productionCost: product.productionCost,
              quantity: 1,
            },
          ],
        });
      }
    }
  };

  const removeFromCart = (id: string) => {
    setCartState({
      ...cartState,
      items: cartState.items.filter((item) => item.id !== id),
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartState({
        ...cartState,
        items: cartState.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      });
    }
  };

  const setShippingCost = (cost: number) => {
    setCartState({ ...cartState, shippingCost: cost });
  };

  const setFreeShippingThreshold = (threshold: number) => {
    setCartState({ ...cartState, freeShippingThreshold: threshold });
  };

  const setOfferFreeShipping = (offer: boolean) => {
    setCartState({ ...cartState, offerFreeShipping: offer });
  };

  const setSelectedProductId = (id: string | null) => {
    setCartState({ ...cartState, selectedProductId: id });
  };

  const setSelectedDiscountId = (id: string | null) => {
    setCartState({ ...cartState, selectedDiscountId: id });
  };

  const subtotal = calculateSubtotal(cartState.items);
  const totalProductionCost = calculateTotalProductionCost(cartState.items);
  const discountedTotal = applyDiscount(
    subtotal,
    cartState.items,
    cartState.selectedDiscountId,
    discounts
  );
  const appliedShippingCost = calculateShippingCost(
    discountedTotal,
    cartState.offerFreeShipping,
    cartState.freeShippingThreshold,
    cartState.shippingCost
  );

  const totalRevenue = discountedTotal + appliedShippingCost;

  const absorbedShippingCost = calculateAbsorbedShippingCost(
    discountedTotal,
    cartState.offerFreeShipping,
    cartState.freeShippingThreshold,
    cartState.shippingCost
  );

  const additionalCostsTotal = cartState.additionalCosts.reduce(
    (total, cost) => {
      if (cost.type === "fixed") {
        return total + cost.value;
      } else {
        // For percentage costs, calculate based on discounted total
        return total + (discountedTotal * cost.value) / 100;
      }
    },
    0
  );

  console.log(discountedTotal, additionalCostsTotal);

  const totalCost =
    totalProductionCost + absorbedShippingCost + additionalCostsTotal;

  const grossProfit = totalRevenue - totalCost - appliedShippingCost;
  const profitMargin =
    (grossProfit / (totalRevenue - appliedShippingCost)) * 100;

  return {
    // State
    cart: cartState.items,
    shippingCost: cartState.shippingCost,
    freeShippingThreshold: cartState.freeShippingThreshold,
    offerFreeShipping: cartState.offerFreeShipping,
    selectedProductId: cartState.selectedProductId,
    selectedDiscountId: cartState.selectedDiscountId,
    additionalCosts: cartState.additionalCosts,
    // Calculations
    subtotal,
    discountedTotal,
    appliedShippingCost,
    totalRevenue,
    totalCost,
    grossProfit,
    profitMargin,
    totalProductionCost,
    absorbedShippingCost,
    additionalCostsTotal,
    // Actions
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    setShippingCost,
    setFreeShippingThreshold,
    setOfferFreeShipping,
    setSelectedProductId,
    setSelectedDiscountId,
    addAdditionalCost: (cost: Omit<AdditionalCost, "id">) => {
      setCartState({
        ...cartState,
        additionalCosts: [
          ...cartState.additionalCosts,
          { ...cost, id: Date.now().toString() },
        ],
      });
    },
    removeAdditionalCost: (id: string) => {
      setCartState({
        ...cartState,
        additionalCosts: cartState.additionalCosts.filter(
          (cost) => cost.id !== id
        ),
      });
    },
  };
}
