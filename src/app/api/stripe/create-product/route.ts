import { USER_ROLES } from "@/lib/constants/user-roles";
import { stripe } from "@/lib/stripe";
import { auth } from "@/server/auth";
import { uploadFileToR2 } from "@/server/utils/r2-upload";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  console.log(session?.user);
  if (!session || session?.user?.role !== USER_ROLES.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not initialized" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const active = formData.get("active") === "true";
    const productType = formData.get("productType") as "one_time" | "recurring";
    const currency = formData.get("currency") as string;

    const marketingFeatures = Array.from(formData.entries())
      .filter(([key]) => key.startsWith("marketingFeature"))
      .map(([, value]) => value as string);

    // Handle image upload
    const image = formData.get("image") as File;
    let imageUrl = "";

    if (image) {
      imageUrl = await uploadFileToR2(image, "products");
    }

    // Create Stripe product
    const productData = {
      name,
      description,
      active,
      images: imageUrl ? [imageUrl] : undefined,
      marketing_features: marketingFeatures.map((feature) => ({
        name: feature,
      })),
      metadata: {
        createdBy: session.user.id,
        productType,
      },
    };

    const product = await stripe.products.create(productData);

    // Create price(s) based on product type
    let defaultPriceId: string | undefined;

    if (productType === "one_time") {
      const price = parseFloat(formData.get("price") as string);
      const priceObject = await stripe.prices.create({
        product: product.id,
        unit_amount: price,
        currency,
      });
      defaultPriceId = priceObject.id; // Store the default price ID
    } else {
      const monthlyPrice = parseFloat(formData.get("monthlyPrice") as string);
      const yearlyPrice = parseFloat(formData.get("yearlyPrice") as string);

      const monthlyPriceObject = await stripe.prices.create({
        product: product.id,
        unit_amount: monthlyPrice,
        currency,
        recurring: { interval: "month" },
      });
      await stripe.prices.create({
        product: product.id,
        unit_amount: yearlyPrice,
        currency,
        recurring: { interval: "year" },
      });
      defaultPriceId = monthlyPriceObject.id; // Store the default price ID
    }

    // Update the product's default price
    await stripe.products.update(product.id, {
      default_price: defaultPriceId,
    });

    return NextResponse.json({ productId: product.id });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
