import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  handler: async (ctx) => {
    return await ctx.db.query("discounts").collect();
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
    return await ctx.db.insert("discounts", {
      ...args,
      value: args.value ?? 0,
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
    return await ctx.db.patch(id, discountData);
  },
});

export const remove = mutation({
  args: {
    id: v.id("discounts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
