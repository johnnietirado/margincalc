import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sendContactUsEmail } from "@/server/services/send-contact-us-email";
import { z } from "zod";

export const utilsRouter = createTRPCRouter({
  sendContactUsEmail: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), message: z.string() })
    )
    .mutation(async ({ input }) => {
      await sendContactUsEmail(input);
    }),
});
