import { db } from "@/convex/_generated/api";
import { type UserJSON } from "@clerk/clerk-sdk-node";
import { type WebhookEvent } from "@clerk/nextjs/server";

export const handleClerkUserUpdated = async (clerkEvent: WebhookEvent) => {
  const data: UserJSON = clerkEvent.data as UserJSON;
  // Create customer in stripe
  const primaryEmail =
    data.email_addresses.find(
      (email) => email.id === data.primary_email_address_id
    )?.email_address ?? "";

  const result = await db
    .update(users)
    .set({
      name: data.first_name + " " + data.last_name,
    })
    .where(eq(users.clerkId, data.id))
    .returning();

  const user = result.pop();

  if (!user) {
    return new Response("User not created", { status: 500 });
  }

  return new Response("", { status: 201 });
};
