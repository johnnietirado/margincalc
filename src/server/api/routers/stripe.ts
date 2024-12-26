import { stripe } from "@/lib/stripe";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const stripeRouter = createTRPCRouter({
  getProducts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(3),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not initialized",
        });
      }

      try {
        const stripeProducts = await stripe.products.list({
          limit: input.limit,
          starting_after: input.cursor,
          expand: ["data.default_price"],
        });

        const products = stripeProducts.data.map((product) => ({
          id: product.id,
          image: product.images[0],
          name: product.name,
          description: product.description ?? "",
          status: product.active ? "active" : "draft",
          price:
            product.default_price &&
            typeof product.default_price === "object" &&
            "unit_amount" in product.default_price
              ? (product.default_price.unit_amount ?? 0) / 100
              : 0,
          category: product.metadata.category ?? "Uncategorized",
          stock: parseInt(product.metadata.stock ?? "0", 10),
          createdAt: new Date(product.created * 1000).toISOString(),
        }));

        return {
          products,
          hasMore: stripeProducts.has_more,
          nextCursor: stripeProducts.data[stripeProducts.data.length - 1]?.id,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch products from Stripe",
          cause: error,
        });
      }
    }),

  createCheckoutSession: protectedProcedure
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not initialized",
        });
      }

      const { priceId } = input;
      const { user } = ctx.session;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/pricing`,
        customer_email: user.email ?? undefined,
      });

      if (!session.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { url: session.url };
    }),
});
