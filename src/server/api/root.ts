import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { type inferRouterOutputs } from "@trpc/server";
import { stripeRouter } from "./routers/stripe";
import { userRouter } from "./routers/user";
import { utilsRouter } from "./routers/utils";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  stripe: stripeRouter,
  utils: utilsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type UserGetOutput = RouterOutput["user"]["getUsers"];
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
