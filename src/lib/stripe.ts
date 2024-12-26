import { env } from "@/env";
import Stripe from "stripe";

let stripe: Stripe | null = null;
if (env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20", // Use the latest API version
  });
}

export { stripe };
