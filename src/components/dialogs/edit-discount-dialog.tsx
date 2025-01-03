"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Pencil } from "lucide-react";
import { useState } from "react";

const discountSchema = z
  .object({
    name: z.string().min(1, "Discount name is required"),
    type: z.enum(["percentOff", "buyXGetY", "amountOff"]),
    value: z.number().min(0, "Value must be 0 or greater").optional(),
    buyX: z.number().min(1, "Buy X must be greater than 0").optional(),
    getY: z.number().min(1, "Get Y must be greater than 0").optional(),
  })
  .refine(
    (data) => {
      if (data.type === "buyXGetY") {
        return data.buyX !== undefined && data.getY !== undefined;
      }
      return data.value !== undefined;
    },
    {
      message: "Required fields missing for selected discount type",
      path: ["type"],
    }
  );

type DiscountFormValues = z.infer<typeof discountSchema>;

interface EditDiscountDialogProps {
  discount: {
    _id: Id<"discounts">;
    name: string;
    type: "percentOff" | "amountOff" | "buyXGetY";
    value?: number;
    buyX?: number;
    getY?: number;
  };
}

export function EditDiscountDialog({ discount }: EditDiscountDialogProps) {
  const [open, setOpen] = useState(false);
  const updateDiscount = useMutation(api.discounts.update);

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: discount.name,
      type: discount.type,
      value: discount.value,
      buyX: discount.buyX,
      getY: discount.getY,
    },
  });

  const discountType = form.watch("type");

  const handleSubmit = async (values: DiscountFormValues) => {
    await updateDiscount({
      id: discount._id,
      ...values,
      value: values.type === "buyXGetY" ? undefined : values.value,
      buyX: values.type === "buyXGetY" ? values.buyX : undefined,
      getY: values.type === "buyXGetY" ? values.getY : undefined,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Discount</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Discount Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentOff">Percentage Off</SelectItem>
                      <SelectItem value="buyXGetY">Buy X Get Y</SelectItem>
                      <SelectItem value="amountOff">Amount Off</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {discountType !== "buyXGetY" && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {discountType === "percentOff"
                        ? "Percent Off (%)"
                        : "Amount Off ($)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step={discountType === "percentOff" ? "0.01" : "1"}
                        placeholder="Value"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {discountType === "buyXGetY" && (
              <>
                <FormField
                  control={form.control}
                  name="buyX"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy X</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Buy X"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="getY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Get Y</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Get Y"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
