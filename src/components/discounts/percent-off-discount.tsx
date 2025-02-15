import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumberSafe } from "@/lib/utils";
import { useState } from "react";

interface PercentOffDiscountProps {
  baseProfit: number;
  sellingPrice: number;
}

export default function PercentOffDiscount({
  baseProfit,
  sellingPrice,
}: PercentOffDiscountProps) {
  const [percentOff, setPercentOff] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const discountAmount = sellingPrice * (percentOff / 100);
  const discountedPrice = sellingPrice - discountAmount;
  const totalRevenue = discountedPrice * quantity;
  const totalCost = (sellingPrice - baseProfit) * quantity;
  const profitAfterDiscount = totalRevenue - totalCost;
  const profitMargin = (profitAfterDiscount / totalRevenue) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="percent-off">Percent Off (%)</Label>
          <Input
            id="percent-off"
            type="number"
            value={percentOff}
            onChange={(e) => setPercentOff(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
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
