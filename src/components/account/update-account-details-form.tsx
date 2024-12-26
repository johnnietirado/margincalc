"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "Name must be at least 1 character.",
  }),
  lastName: z.string().min(1, {
    message: "Last name must be at least 1 character.",
  }),
});

export function UpdateAccountDetailsForm() {
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  const { mutate, isPending } = api.user.updateName.useMutation({
    onSuccess: () => {
      user?.reload();
      toast.success("Account details updated");
    },
    onError: (error) => {
      console.error("Failed to update name:", error);
      toast.error("Failed to update name");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Update Account Details</CardTitle>
            <CardDescription>Update your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel>Account Email</FormLabel>
              <FormControl>
                <Input
                  value={user?.emailAddresses[0]?.emailAddress ?? ""}
                  disabled
                />
              </FormControl>
              <FormDescription>This is your account address.</FormDescription>
              <FormMessage />
            </FormItem>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <SubmitButton isPending={isPending}>Update</SubmitButton>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
