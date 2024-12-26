import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
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

    return await ctx.db.insert("products", {
      name,
      prices,
      productionCost,
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
    return await ctx.db.delete(args.id);
  },
});
