import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/lib/contexts/cart-context";
import { useQuery } from "convex/react";
import { useState } from "react";

export function CartBuilder() {
  const products = useQuery(api.products.get) ?? [];
  const discounts = useQuery(api.discounts.get) ?? [];
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  const {
    cart,
    shippingCost,
    freeShippingThreshold,
    offerFreeShipping,
    selectedProductId,
    selectedDiscountId,
    subtotal,
    discountedTotal,
    totalRevenue,
    appliedShippingCost,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    setShippingCost,
    setFreeShippingThreshold,
    setOfferFreeShipping,
    setSelectedProductId,
    setSelectedDiscountId,
  } = useCart();

  const selectedProduct = products.find((p) => p._id === selectedProductId);

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    setSelectedPriceId(null);
  };

  return (
    <div className="flex flex-col gap-4 col-span-2">
      <h1 className="text-2xl font-bold">Cart Simulator</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <Label htmlFor="product-select">Select Product</Label>
            <Select
              value={selectedProductId || undefined}
              onValueChange={handleProductChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="price-select">Select Price</Label>
            <Select
              value={selectedPriceId || undefined}
              onValueChange={setSelectedPriceId}
              disabled={!selectedProduct}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a price" />
              </SelectTrigger>
              <SelectContent>
                {selectedProduct?.prices.map((price) => (
                  <SelectItem key={price.id} value={price.id}>
                    ${price.value.toFixed(2)} ({price.alias})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end col-span-1">
            <Button
              onClick={() => addToCart(selectedPriceId!)}
              disabled={!selectedProductId || !selectedPriceId}
              className="w-full"
            >
              Add to Cart
            </Button>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discount-select">Apply Discount</Label>
            <Select
              value={selectedDiscountId || undefined}
              onValueChange={setSelectedDiscountId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a discount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_discount">No Discount</SelectItem>
                {discounts.map((discount) => (
                  <SelectItem key={discount._id} value={discount._id}>
                    {discount.name} ({discount.type}) ({discount.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <h4 className="text-lg font-semibold">Shipping</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shipping-cost">Shipping Cost ($)</Label>
            <Input
              id="shipping-cost"
              type="number"
              step="0.01"
              value={shippingCost}
              onChange={(e) => setShippingCost(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end space-x-2 mb-2">
            <Switch
              id="offer-free-shipping"
              checked={offerFreeShipping}
              onCheckedChange={setOfferFreeShipping}
            />
            <Label htmlFor="offer-free-shipping" className="pb-1">
              Offer Free Shipping
            </Label>
          </div>
        </div>
        {offerFreeShipping && (
          <div>
            <Label htmlFor="free-shipping-threshold">
              Free Shipping Threshold ($)
            </Label>
            <Input
              id="free-shipping-threshold"
              type="number"
              step="0.01"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <div className="mt-6 space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Production Cost</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Margin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
                <TableCell>${item.productionCost.toFixed(2)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartItemQuantity(item.id, Number(e.target.value))
                    }
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  ${(item.sellingPrice * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell>
                  ${(item.productionCost * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell>
                  {(
                    ((item.sellingPrice - item.productionCost) /
                      item.sellingPrice) *
                    100
                  ).toFixed(2)}
                  %
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row justify-between">
              <p>
                <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
              </p>
              <p>
                <strong>Discount:</strong> $
                {(subtotal - discountedTotal).toFixed(2)}
              </p>
              <p>
                <strong>Shipping:</strong> ${appliedShippingCost.toFixed(2)}
              </p>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-lg font-semibold">
              <strong>Total:</strong> ${totalRevenue.toFixed(2)}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}