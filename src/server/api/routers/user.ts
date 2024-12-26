import { db } from "@/database";
import { users } from "@/database/schema";
import { stripe } from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { desc, eq, like, sql, type SQL } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .input(
      z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive(),
        nameFilter: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, nameFilter } = input;
      const offset = (page - 1) * limit;

      const whereClause: SQL | undefined = nameFilter
        ? like(users.name, `%${nameFilter}%`)
        : undefined;

      const [userList, totalCount] = await Promise.all([
        ctx.db
          .select()
          .from(users)
          .where(whereClause)
          .orderBy(desc(users.createdAt))
          .limit(limit)
          .offset(offset),
        ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(users)
          .where(whereClause)
          .then((result) => result[0]?.count ?? 0),
      ]);

      const ids = userList.map((user) => user.clerkId);

      const client = await clerkClient();

      const clerkUsers = await client.users.getUserList({
        userId: ids,
      });

      return {
        users: userList.map((user) => {
          const clerkUser = clerkUsers.data.find(
            (clerkUser) => clerkUser.id === user.clerkId
          );
          return {
            ...user,
            imageUrl: clerkUser?.imageUrl,
          };
        }),
        totalCount,
      };
    }),
  createStripeCustomer: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, input.userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (user.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already has a Stripe customer ID",
        });
      }

      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not initialized",
        });
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
      });

      await ctx.db
        .update(users)
        .set({ stripeCustomerId: customer.id })
        .where(eq(users.id, user.id));

      return { success: true, stripeCustomerId: customer.id };
    }),
  updateName: protectedProcedure
    .input(
      z.object({ firstName: z.string().min(1), lastName: z.string().min(1) })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const client = clerkClient();
      await client.users.updateUser(userId, {
        firstName: input.firstName,
        lastName: input.lastName,
      });

      await ctx.db
        .update(users)
        .set({
          name: `${input.firstName} ${input.lastName}`,
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),
  initiateStripeCheckout: protectedProcedure
    .input(
      z.object({
        productName: z.string(),
        productDescription: z.string(),
        amount: z.number().int().positive(),
        currency: z.string().length(3).default("usd"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productName, productDescription, amount, currency } = input;
      const userId = ctx.session.user.id;

      if (!stripe) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe is not initialized",
        });
      }

      // Fetch the user from the database
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Create or retrieve the Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name ?? undefined,
        });
        stripeCustomerId = customer.id;

        // Update the user with the new Stripe customer ID
        await db
          .update(users)
          .set({ stripeCustomerId })
          .where(eq(users.id, userId));
      }

      // Create the checkout session with inline product creation
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: productName,
                description: productDescription,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `http://localhost:3000/payment-received`,
        cancel_url: `http://localhost:3000/payment-cancelled`,
      });

      if (!session.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return { checkoutUrl: session.url };
    }),
});
