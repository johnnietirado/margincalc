import { env } from "@/env";
import { stripe } from "@/lib/stripe";
import {
  handleCheckoutSessionCompleted,
  handleCustomerCreated,
} from "@/server/services/stripe-webhook-handlers";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  if (!stripe) {
    console.warn("Stripe is not initialized. Skipping webhook processing.");
    return NextResponse.json({ received: true, processed: false });
  }

  const body = await req.text();
  const signature = await headers().get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  if (event.type === "customer.created") {
    try {
      const result = await handleCustomerCreated(event.data.object);
      return NextResponse.json(result);
    } catch (error) {
      console.error("Error handling customer creation:", error);
      return NextResponse.json(
        { error: "Error handling customer creation" },
        { status: 500 }
      );
    }
  }

  if (event.type === "checkout.session.completed") {
    try {
      const result = await handleCheckoutSessionCompleted(event.data.object);
      return NextResponse.json(result);
    } catch (error) {
      console.error("Error handling checkout session completion:", error);
      return NextResponse.json(
        { error: "Error handling checkout session completion" },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ received: true });
}
