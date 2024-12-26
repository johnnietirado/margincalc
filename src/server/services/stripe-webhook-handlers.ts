import { db } from "@/database";
import { users } from "@/database/schema";
import type Stripe from "stripe";

export async function handleCustomerCreated(customer: Stripe.Customer) {
  if (!customer.email) {
    throw new Error("Customer email is required");
  }

  await db.insert(users).values({
    email: customer.email,
    stripeCustomerId: customer.id,
    name: customer.name ?? null,
  });

  return { received: true, created: true };
}

export async function handleCheckoutSessionCompleted(
  checkoutSession: Stripe.Checkout.Session
) {
  console.log("checkoutSessionCompleted", checkoutSession);
  return { received: true };
}
