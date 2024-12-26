import ProductDetails from "@/components/products/product-details";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

async function getProduct(stripeProductId: string) {
  if (!stripe) {
    return null;
  }

  const product = await stripe.products.retrieve(stripeProductId, {
    expand: ["default_price"],
  });
  return product;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: { stripeProductId: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const product = await getProduct(params.stripeProductId);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
