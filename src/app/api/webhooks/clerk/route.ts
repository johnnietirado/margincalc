import { env } from "@/env";
import { handleClerkUserCreated } from "@/server/services/handle-clerk-user-created";
import { handleClerkUserUpdated } from "@/server/services/handle-clerk-user-update";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { headers } from "next/headers";
import { Webhook } from "svix";

export const runtime = "nodejs";

export async function GET() {
  return new Response("Method not allowed", { status: 405 });
}

export async function POST(request: Request) {
  if (!env.CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  const payload = (await request.json()) as WebhookEvent;
  const body = JSON.stringify(payload);

  // Verify the payload with the headers
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  try {
    wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const clerkEvent = payload;
  try {
    if (clerkEvent.type === "user.created") {
      return await handleClerkUserCreated(clerkEvent);
    }

    if (clerkEvent.type === "user.updated") {
      return await handleClerkUserUpdated(clerkEvent);
    }

    return new Response("Event not handled", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("", { status: 500 });
  }
}
