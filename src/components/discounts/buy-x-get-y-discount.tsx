import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumberSafe } from "@/lib/utils";
import { useState } from "react";

interface BuyXGetYDiscountProps {
  baseProfit: number;
  sellingPrice: number;
}

export default function BuyXGetYDiscount({
  baseProfit,
  sellingPrice,
}: BuyXGetYDiscountProps) {
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [getFreeQuantity, setGetFreeQuantity] = useState(0);

  const totalQuantity = buyQuantity + getFreeQuantity;
  const discountAmount = (getFreeQuantity / totalQuantity) * sellingPrice;
  const discountedPrice = sellingPrice - discountAmount;
  const totalRevenue = discountedPrice * totalQuantity;
  const totalCost = (sellingPrice - baseProfit) * totalQuantity;
  const profitAfterDiscount = totalRevenue - totalCost;
  const profitMargin = (profitAfterDiscount / totalRevenue) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="buy-quantity">Buy Quantity</Label>
          <Input
            id="buy-quantity"
            type="number"
            value={buyQuantity}
            onChange={(e) => setBuyQuantity(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="get-free-quantity">Get Free Quantity</Label>
          <Input
            id="get-free-quantity"
            type="number"
            value={getFreeQuantity}
            onChange={(e) => setGetFreeQuantity(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Discounted Price (per item):</p>
          <p>${formatNumberSafe(discountedPrice)}</p>
        </div>
        <div>
          <p className="font-semibold">Total Revenue:</p>
          <p>${formatNumberSafe(totalRevenue)}</p>
        </div>
        <div>
          <p className="font-semibold">Total Cost:</p>
          <p>${formatNumberSafe(totalCost)}</p>
        </div>
        <div>
          <p className="font-semibold">Profit After Discount:</p>
          <p>${formatNumberSafe(profitAfterDiscount)}</p>
        </div>
        <div>
          <p className="font-semibold">Profit Margin:</p>
          <p>{formatNumberSafe(profitMargin)}%</p>
        </div>
      </div>
    </div>
  );
}
