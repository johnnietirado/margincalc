"use server";

import { stripe } from "@/lib/stripe";
import { uploadFileToR2 } from "@/server/utils/r2-upload";
import { authedProcedure } from "@/server/zsaProcedures";
import z from "zod";
import { ZSAError } from "zsa";

export const createStripeProduct = authedProcedure
  .createServerAction()
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
      active: z.boolean().default(false),
      productType: z.enum(["one_time", "recurring"]),
      currency: z.string(),
      marketingFeatures: z.string().optional(),
      price: z.number().optional(),
      monthlyPrice: z.number().optional(),
      yearlyPrice: z.number().optional(),
      image: z.custom<File>((v) => v instanceof File, {
        message: "Expected a File object",
      }),
    }),
    {
      type: "formData",
    }
  )
  .handler(async ({ ctx, input }) => {
    if (!stripe) {
      throw new ZSAError("INTERNAL_SERVER_ERROR", {
        message: "Stripe is not initialized",
      });
    }

    try {
      const { name, description, active, productType, currency, ...rest } =
        input;

      const marketingFeatures = JSON.parse(
        rest.marketingFeatures ?? "[]"
      ) as Array<{ name: string }>;

      const image = rest.image;
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadFileToR2(image, "products");
      }

      const productData = {
        name,
        description,
        active,
        images: imageUrl ? [imageUrl] : undefined,
        marketing_features: marketingFeatures,
        metadata: {
          createdBy: ctx.session.user.id,
          productType,
        },
      };

      const product = await stripe.products.create(productData);

      // Create price(s) based on product type
      let defaultPriceId: string | undefined;

      if (productType === "one_time") {
        const price = input.price;
        const priceObject = await stripe.prices.create({
          product: product.id,
          unit_amount: price,
          currency,
        });
        defaultPriceId = priceObject.id; // Store the default price ID
      } else {
        const monthlyPrice = input.monthlyPrice ?? 0; // Default to 0 if undefined
        const yearlyPrice = input.yearlyPrice ?? 0; // Default to 0 if undefined
        const monthlyPriceObject = await stripe.prices.create({
          product: product.id,
          unit_amount: monthlyPrice * 100, // Convert to cents
          currency,
          recurring: { interval: "month" },
        });
        await stripe.prices.create({
          product: product.id,
          unit_amount: yearlyPrice * 100, // Convert to cents
          currency,
          recurring: { interval: "year" },
        });
        defaultPriceId = monthlyPriceObject.id; // Store the default price ID
      }

      // Update the product's default price
      await stripe.products.update(product.id, {
        default_price: defaultPriceId,
      });

      return { product, defaultPriceId };
    } catch (error) {
      console.error("Error creating product:", error);
      throw new ZSAError("INTERNAL_SERVER_ERROR", {
        message: "Error creating product",
      });
    }
  });
