import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// @snippet start schema
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  organizations: defineTable({
    clerkId: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

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
    organizationId: v.id("organizations"),
  }).index("by_organization", ["organizationId"]),

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
    organizationId: v.id("organizations"),
  }).index("by_organization", ["organizationId"]),

  carts: defineTable({
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
    organizationId: v.id("organizations"),
  }).index("by_organization", ["organizationId"]),
});
// @snippet end schema
