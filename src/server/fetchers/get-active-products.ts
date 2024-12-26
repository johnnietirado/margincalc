import { stripe } from "@/lib/stripe";
import { cache } from "react";
import type Stripe from "stripe";

interface Product {
  id: string;
  name: string;
  description: string | null;
  defaultPriceId: string;
  unitAmount: number | null;
  features: string[];
}

export const getActiveProducts = cache(async (): Promise<Product[]> => {
  if (!stripe) {
    return [];
  }

  try {
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    return products.data.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      defaultPriceId: (product.default_price as Stripe.Price)?.id || "",
      unitAmount: (product.default_price as Stripe.Price)?.unit_amount ?? null,
      features: product.marketing_features
        .map((feature) => feature.name)
        .filter((name): name is string => name !== undefined),
    }));
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
});
