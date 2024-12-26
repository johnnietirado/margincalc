"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { type ClientMessage } from "@/server/actions/ai";
import { TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { ChevronDownIcon, SendIcon, WandSparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const maxDuration = 30;

export function AiChatbot() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState<string>("");

  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!showScrollButton) {
      scrollToBottom();
    }
  }, [conversation, showScrollButton, scrollToBottom]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry?.isIntersecting);
      },
      { root: scrollArea, threshold: 0.1 }
    );

    const messagesEnd = messagesEndRef.current;
    if (messagesEnd) {
      observer.observe(messagesEnd);
    }

    return () => {
      if (messagesEnd) {
        observer.unobserve(messagesEnd);
      }
    };
  }, []);

  const handleSubmit = async ({ curInput }: { curInput: string }) => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: "user", display: curInput },
    ]);

    const message = await continueConversation({
      input: curInput,
    });

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message as ClientMessage,
    ]);

    setInput("");
  };

  const handlePredefinedQuestion = async () => {
    await handleSubmit({ curInput: "What products you offer?" });
  };

  return (
    <TooltipProvider>
      <div className="relative flex h-[600px] max-w-md flex-col overflow-hidden rounded-lg border">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {(conversation as ClientMessage[]).length === 0 && (
            <Button
              onClick={handlePredefinedQuestion}
              className="absolute bottom-4"
              variant="outline"
            >
              <WandSparkles className="mr-2 h-4 w-4" />
              What products you offer?
            </Button>
          )}
          {(conversation as ClientMessage[]).map(
            (message: ClientMessage, index: number) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block rounded-lg p-2 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.display}
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>
        <form
          onSubmit={() => handleSubmit({ curInput: input })}
          className="flex items-center border-t p-4"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mr-2 flex-grow"
          />
          <Button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              await handleSubmit({ curInput: input });
            }}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        {showScrollButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="absolute bottom-20 right-4 rounded-full p-2"
                onClick={scrollToBottom}
                variant="outline"
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Scroll to bottom</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
