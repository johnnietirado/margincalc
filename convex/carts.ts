import { Id } from "@/convex/_generated/dataModel";
import { getUserOrganization } from "@/convex/utils";
import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    const userOrganization = await getUserOrganization(ctx);
    return await ctx.db
      .query("carts")
      .filter((q) => q.eq(q.field("organizationId"), userOrganization.id))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    products: v.array(
      v.object({
        productId: v.id("products"),
        priceValue: v.number(),
        priceAlias: v.string(),
        quantity: v.number(),
      })
    ),
    discounts: v.array(
      v.object({
        name: v.string(),
        type: v.union(
          v.literal("percentOff"),
          v.literal("amountOff"),
          v.literal("buyXGetY")
        ),
        value: v.optional(v.number()),
        buyX: v.optional(v.number()),
        getY: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { name, description, products, discounts } = args;
    const { id: organizationId } = await getUserOrganization(ctx);
    if (!organizationId) {
      throw new ConvexError("No organization for this user");
    }

    // Verify all products belong to the organization
    for (const product of products) {
      if (
        !(await isProductInOrganization(ctx, organizationId, product.productId))
      ) {
        throw new ConvexError("Product not found in organization");
      }
    }

    return await ctx.db.insert("carts", {
      name,
      description,
      products,
      discounts,
      organizationId,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("carts"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const { id: organizationId } = await getUserOrganization(ctx);
    if (!organizationId) {
      throw new ConvexError("No organization for this user");
    }
    if (!(await isCartInOrganization(ctx, organizationId, id))) {
      throw new ConvexError("Cart not found in organization");
    }
    return await ctx.db.delete(id);
  },
});

const isCartInOrganization = async (
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
  cartId: Id<"carts">
) => {
  try {
    const cart = await ctx.db
      .query("carts")
      .filter((q) =>
        q.and(
          q.eq(q.field("_id"), cartId),
          q.eq(q.field("organizationId"), organizationId)
        )
      )
      .first();
    return cart !== null;
  } catch (error) {
    return false;
  }
};

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
