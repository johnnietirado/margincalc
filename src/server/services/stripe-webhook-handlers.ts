import type Stripe from "stripe";

export async function handleCustomerCreated(customer: Stripe.Customer) {
  if (!customer.email) {
    throw new Error("Customer email is required");
  }

  return { received: true, created: true };
}

export async function handleCheckoutSessionCompleted(
  checkoutSession: Stripe.Checkout.Session
) {
  return { received: true };
}
