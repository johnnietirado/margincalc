import { AI } from "@/app/ai";
import { AiChatbot } from "@/components/ai-chatbot";
import Link from "next/link";

export default function Page() {
  return (
    <div className="col-span-3">
      <div className="mb-8 flex max-w-screen-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">AI Chatbot</h1>
        <p className="text-sm text-gray-800 dark:text-gray-400">
          This is an example of an AI chatbot. You can ask it any questions
          about the products in your store. Make sure to add your Open AI key in
          the .env file. If you don&apos;t have any products in your store, you
          can add them in the{" "}
          <Link href="/dashboard/products" className="underline">
            products
          </Link>{" "}
          page.
        </p>
      </div>
      <AI>
        <AiChatbot />
      </AI>
    </div>
  );
}
