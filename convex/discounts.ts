import { Id } from "@/convex/_generated/dataModel";
import { getUserOrganization } from "@/convex/utils";
import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const userOrganization = await getUserOrganization(ctx);
    return await ctx.db
      .query("discounts")
      .filter((q) => q.eq(q.field("organizationId"), userOrganization.id))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    type: v.union(
      v.literal("percentOff"),
      v.literal("amountOff"),
      v.literal("buyXGetY")
    ),
    value: v.optional(v.number()),
    buyX: v.optional(v.number()),
    getY: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id: organizationId } = await getUserOrganization(ctx);
    if (!organizationId) {
      throw new ConvexError("No organization for this user");
    }

    return await ctx.db.insert("discounts", {
      ...args,
      value: args.value ?? 0,
      organizationId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("discounts"),
    name: v.string(),
    type: v.union(
      v.literal("percentOff"),
      v.literal("amountOff"),
      v.literal("buyXGetY")
    ),
    value: v.optional(v.number()),
    buyX: v.optional(v.number()),
    getY: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...discountData } = args;
    const { id: organizationId } = await getUserOrganization(ctx);
    if (!organizationId) {
      throw new ConvexError("No organization for this user");
    }
    if (!(await isDiscountInOrganization(ctx, organizationId, id))) {
      throw new ConvexError("Discount not found in organization");
    }

    return await ctx.db.patch(id, discountData);
  },
});

export const remove = mutation({
  args: {
    id: v.id("discounts"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const { id: organizationId } = await getUserOrganization(ctx);
    if (!organizationId) {
      throw new ConvexError("No organization for this user");
    }
    if (!(await isDiscountInOrganization(ctx, organizationId, id))) {
      throw new ConvexError("Discount not found in organization");
    }
    return await ctx.db.delete(id);
  },
});

const isDiscountInOrganization = async (
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
  discountId: Id<"discounts">
) => {
  try {
    const discount = await ctx.db
      .query("discounts")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), discountId),
          q.eq(q.field("organizationId"), organizationId)
        )
      )
      .first();
    return discount !== null;
  } catch (error) {
    return false;
  }
};
