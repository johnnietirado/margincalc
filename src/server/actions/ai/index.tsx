"use server";

import { ChatProducts } from "@/components/ai-chatbot/chat-products";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveProducts } from "@/server/fetchers/get-active-products";
import { openai } from "@ai-sdk/openai";
import { generateId } from "ai";
import { getMutableAIState, streamUI } from "ai/rsc";
import { type ReactNode } from "react";
import z from "zod";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

export async function continueConversation({
  input,
}: {
  input: string;
}): Promise<ClientMessage> {
  "use server";

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai("gpt-4o-mini"),
    system:
      "You are a helpful assistant that gives back information about the products in our SaaS application.",
    messages: [...history.get(), { role: "user", content: input }],
    toolChoice: "auto",
    tools: {
      getProducts: {
        description: "Get a list of products",
        parameters: z.object({
          category: z.string().optional(),
        }),
        generate: async function* () {
          const products = await getActiveProducts();
          yield <Skeleton className="h-4 w-full" />;
          return <ChatProducts products={products} />;
        },
      },
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}
