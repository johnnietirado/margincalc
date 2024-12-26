"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendMagicLink } from "@/server/actions/send-magic-link";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function MagicLinkLogin() {
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const params = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const result = await sendMagicLink(
        values.email,
        params.get("callbackUrl") ?? "/"
      );
      if (result.success) {
        form.reset();
        setIsSubmitted(true);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-md overflow-hidden rounded-lg border"
    >
      <div className="p-8">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 text-center text-3xl font-bold"
        >
          Sign In with Email
        </motion.h2>
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="mb-4 text-lg text-gray-800">Magic link sent!</p>
            <p className="text-md text-gray-600">
              Please check your email for the login link.
            </p>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full transform rounded-md px-4 py-3 font-bold transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>
          </Form>
        )}
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="border-t px-8 py-4 text-center"
      >
        <p className="text-sm">
          No password needed! We&apos;ll send you a magic link to log in
          instantly.
        </p>
      </motion.div>
    </motion.div>
  );
}
