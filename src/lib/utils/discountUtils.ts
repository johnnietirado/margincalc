import { Discount } from "@/components/discounts/discount-manager";

export const getHumanReadableType = (type: Discount["type"]): string => {
  switch (type) {
    case "percentOff":
      return "Percentage Off";
    case "buyXGetY":
      return "Buy X Get Y";
    case "amountOff":
      return "Amount Off";
    default:
      return type; // Fallback in case of an unknown type
  }
};
