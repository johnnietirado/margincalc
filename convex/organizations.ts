import { OrganizationJSON } from "@clerk/nextjs/server";
import { v, Validator } from "convex/values";
import { internalMutation, query, QueryCtx } from "./_generated/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentOrganization(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<OrganizationJSON> },
  async handler(ctx, { data }) {
    const organizationAttributes = {
      name: data.name,
      clerkId: data.id,
      createdAt: Date.now(),
    };

    const organization = await organizationByClerkId(ctx, data.id);
    if (organization === null) {
      await ctx.db.insert("organizations", organizationAttributes);
    } else {
      await ctx.db.patch(organization._id, organizationAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkOrgId: v.string() },
  async handler(ctx, { clerkOrgId }) {
    const organization = await organizationByClerkId(ctx, clerkOrgId);

    if (organization !== null) {
      await ctx.db.delete(organization._id);
    } else {
      console.warn(
        `Can't delete organization, there is none for Clerk org ID: ${clerkOrgId}`
      );
    }
  },
});

export async function getCurrentOrganizationOrThrow(ctx: QueryCtx) {
  const organizationRecord = await getCurrentOrganization(ctx);
  if (!organizationRecord) throw new Error("Can't get current organization");
  return organizationRecord;
}

export async function getCurrentOrganization(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null || !identity.orgId) {
    return null;
  }

  const organization = await ctx.db
    .query("organizations")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.orgId))
    .unique();

  return organization;
}

async function organizationByClerkId(ctx: QueryCtx, clerkId: string) {
  return await ctx.db
    .query("organizations")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
    .unique();
}
