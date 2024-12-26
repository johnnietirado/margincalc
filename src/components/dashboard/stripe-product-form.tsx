"use client";

import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createStripeProduct } from "@/server/actions/stripe/create-stripe-product";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { ImageUpload } from "../image-upload";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    active: z.boolean(),
    productType: z.enum(["one_time", "recurring"]),
    price: z.string().optional(),
    monthlyPrice: z.string().optional(),
    yearlyPrice: z.string().optional(),
    currency: z.string().min(1, { message: "Currency is required" }),
    marketingFeatures: z.array(z.object({ value: z.string() })),
  })
  .refine(
    (data) => {
      if (data.productType === "one_time") {
        return !!data.price;
      } else {
        return !!data.monthlyPrice && !!data.yearlyPrice;
      }
    },
    {
      message: "Price is required for the selected product type",
      path: ["price"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export default function StripeProductForm() {
  const { execute, isPending } = useServerAction(createStripeProduct);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
      productType: "one_time",
      price: "",
      monthlyPrice: "",
      yearlyPrice: "",
      currency: "USD",
      marketingFeatures: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "marketingFeatures",
  });

  const [image, setImage] = useState<File | null>(null);

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "marketingFeatures") {
        (value as { value: string }[]).forEach((feature, index) => {
          if (feature.value) {
            formData.append(`marketingFeature${index}`, feature.value);
          }
        });
      } else {
        formData.append(key, value.toString());
      }
    });

    if (image) {
      formData.append("image", image);
    }

    try {
      const [data, err] = await execute(formData);
      if (err) {
        toast.error(err.message);
        return;
      }
      router.push(`/dashboard/products/${data.product.id}`);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    }
  };

  return (
    <Card className="max-w-screen-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create a new product
            </CardTitle>
            <CardDescription>
              Create a new product to sell on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Whether this product is active and available for purchase
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="one_time" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          One-time payment
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="recurring" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Recurring subscription
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("productType") === "one_time" && (
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      The price of the product in the currency selected in{" "}
                      <span className="font-bold">cents</span>.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("productType") === "recurring" && (
              <>
                <FormField
                  control={form.control}
                  name="monthlyPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Price</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        The monthly subscription price in{" "}
                        <span className="font-bold">cents</span>.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearlyPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yearly Price</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        The yearly subscription price in{" "}
                        <span className="font-bold">cents</span>. Consider
                        offering a discount.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="min-w-32">
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUpload onFileChange={setImage} />
              </FormControl>
              <FormDescription>Upload a square image, max 5MB.</FormDescription>
            </FormItem>

            <div>
              <FormLabel>Marketing Features</FormLabel>
              <div className="flex flex-col space-y-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`marketingFeatures.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              {...field}
                              placeholder={`Marketing feature ${index + 1}`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
              >
                Add Marketing Feature
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Product"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
