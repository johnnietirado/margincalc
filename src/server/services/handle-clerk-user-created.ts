import { db } from "@/database";
import { users } from "@/database/schema";
import { stripe } from "@/lib/stripe";
import { type UserJSON } from "@clerk/clerk-sdk-node";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";

export const handleClerkUserCreated = async (clerkEvent: WebhookEvent) => {
  const data: UserJSON = clerkEvent.data as UserJSON;
  // Create customer in stripe
  const primaryEmail =
    data.email_addresses.find(
      (email) => email.id === data.primary_email_address_id
    )?.email_address ?? "";

  let stripeCustomerId: string | undefined;

  if (stripe) {
    const customer = await stripe.customers.create({
      email: primaryEmail ? primaryEmail : undefined,
      name: data.first_name + " " + data.last_name,
      metadata: {
        clerkId: data.id,
      },
    });

    stripeCustomerId = customer.id;
    const client = await clerkClient();

    await client.users.updateUserMetadata(data.id, {
      privateMetadata: {
        stripeCustomerId,
      },
    });
  }

  const result = await db
    .insert(users)
    .values({
      clerkId: data.id,
      email: primaryEmail,
      name: data.first_name + " " + data.last_name,
      stripeCustomerId,
    })
    .returning();

  const user = result.pop();

  if (!user) {
    return new Response("User not created", { status: 500 });
  }

  return new Response("", { status: 201 });
};
