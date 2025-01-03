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
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { generateUUID } from "@/lib/utils/uuid";
import { useMutation } from "convex/react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

const priceSchema = z.object({
  id: z.string(),
  alias: z.string().min(1, "Price alias is required"),
  value: z.number().min(0.01, "Price must be greater than 0"),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  prices: z.array(priceSchema).min(1, "At least one price is required"),
  productionCost: z.number().min(0, "Production cost must be 0 or greater"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function CreateProductDialog() {
  const [open, setOpen] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const createProduct = useMutation(api.products.create);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      prices: [{ id: generateUUID(), alias: "Regular", value: 0 }],
      productionCost: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prices",
  });

  const handleSubmit = async (values: ProductFormValues) => {
    await createProduct({
      name: values.name,
      prices: values.prices,
      productionCost: values.productionCost,
    });

    form.reset();

    if (!keepOpen) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="">
          <span className="hidden md:block">Add Product</span>
          <PlusCircle className="h-4 w-4 md:hidden" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
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
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Prices</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ id: generateUUID(), alias: "", value: 0 })
                  }
                  className="h-8"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Price
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr,1fr,auto] gap-4 items-start"
                >
                  <FormField
                    control={form.control}
                    name={`prices.${index}.alias`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Price Alias" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`prices.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Price Value"
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
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="productionCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Cost ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={keepOpen}
                  onCheckedChange={(checked) => setKeepOpen(!!checked)}
                  className="mb-2"
                  id="keep-open"
                />
                <label
                  htmlFor="keep-open"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep open
                </label>
              </div>
              <Button type="submit">Add Product</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
