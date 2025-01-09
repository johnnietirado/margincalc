import { QueryCtx } from "@/convex/_generated/server";
import { ConvexError } from "convex/values";

export async function getUserOrganization(ctx: QueryCtx) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
  const organization = await ctx.db
    .query("organizations")
    .filter((q) => q.eq(q.field("clerkId"), user?.organization_id))
    .first();
  if (!organization) {
    throw new ConvexError("No organization for this user");
  }
  return {
    id: organization._id,
    clerkOrganizationId: user?.organization_id as string | null,
    role: user?.organization_role as string | null,
  };
}
