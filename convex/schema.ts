import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// @snippet start schema
export default defineSchema({
  products: defineTable({
    name: v.string(),
    prices: v.array(
      v.object({
        id: v.string(),
        alias: v.string(),
        value: v.number(),
      })
    ),
    productionCost: v.number(),
  }),
  discounts: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("percentOff"),
      v.literal("amountOff"),
      v.literal("buyXGetY")
    ),
    value: v.optional(v.number()),
    buyX: v.optional(v.number()),
    getY: v.optional(v.number()),
  }),
});
// @snippet end schema
