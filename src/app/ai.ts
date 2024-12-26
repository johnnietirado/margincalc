import {
  type ClientMessage,
  continueConversation,
  type ServerMessage,
} from "@/server/actions/ai";
import { createAI } from "ai/rsc";

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
