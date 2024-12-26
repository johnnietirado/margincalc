import { getActiveProducts } from "@/server/fetchers/get-active-products";
import { tiers as mockTiers } from "./mock-tiers";
import Tiers from "./tiers";

export default async function PricingSection() {
  const products = await getActiveProducts();

  let tiers;
  if (products.length > 0) {
    tiers = products.map((product, index) => ({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      priceMonthly: `$${((product.unitAmount ?? 0) / 100).toFixed(2)}`,
      features: product.features,
      mostPopular: index === 1, // Assuming the second tier is most popular
      stripePriceId: product.defaultPriceId,
    }));
  } else {
    tiers = mockTiers;
  }

  return <Tiers initialTiers={tiers} />;
}
