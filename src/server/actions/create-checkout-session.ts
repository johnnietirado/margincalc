"use server";

import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import type Stripe from "stripe";

const baseUrl = env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

export async function createCheckoutSession(priceId: string) {
  if (!stripe) {
    throw new Error("Stripe is not initialized");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Fetch the user's stripeCustomerId from the database
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
  };

  params.customer = user?.stripeCustomerId ?? userId;

  const checkoutSession = await stripe.checkout.sessions.create(params);

  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session");
  }

  return { url: checkoutSession.url };
}
