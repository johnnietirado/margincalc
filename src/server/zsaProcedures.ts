import { auth } from "@/server/auth";
import { createServerActionProcedure } from "zsa";

export const authedProcedure = createServerActionProcedure().handler(
  async () => {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }
    return { session };
  }
);
