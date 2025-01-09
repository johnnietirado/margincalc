import { Id } from "@/convex/_generated/dataModel";
import { getUserOrganization } from "@/convex/utils";
import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const userOrganization = await getUserOrganization(ctx);
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("organizationId"), userOrganization.id))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    prices: v.array(
      v.object({
        id: v.string(),
        alias: v.string(),
        value: v.number(),
      })
    ),
    productionCost: v.number(),
  },
  handler: async (ctx, args) => {
    const { name, prices, productionCost } = args;
    const { id: organizationId } = await getUserOrganization(ctx);
    if (!organizationId) {
      throw new ConvexError("No organization for this user");
    }

    return await ctx.db.insert("products", {
      name,
      prices,
      productionCost,
      organizationId,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.string(),
    prices: v.array(
      v.object({
        id: v.string(),
        alias: v.string(),
        value: v.number(),
      })
    ),
    productionCost: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, name, prices, productionCost } = args;
    const { id: organizationId } = await getUserOrganization(ctx);
    if (!organizationId) {
      throw new ConvexError("No organization for this user");
    }
    if (!(await isProductInOrganization(ctx, organizationId, id))) {
      throw new ConvexError("Product not found in organization");
    }

    return await ctx.db.patch(id, {
      name,
      prices,
      productionCost,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const { id: organizationId } = await getUserOrganization(ctx);
    if (!organizationId) {
      throw new ConvexError("No organization for this user");
    }
    if (!(await isProductInOrganization(ctx, organizationId, id))) {
      throw new ConvexError("Product not found in organization");
    }
    return await ctx.db.delete(id);
  },
});

const isProductInOrganization = async (
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
  productId: Id<"products">
) => {
  try {
    const product = await ctx.db
      .query("products")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), productId),
          q.eq(q.field("organizationId"), organizationId)
        )
      )
      .first();
    return product !== null;
  } catch (error) {
    return false;
  }
};
