import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface QuantityOffDiscountProps {
  baseProfit: number
  sellingPrice: number
}

export default function QuantityOffDiscount({ baseProfit, sellingPrice }: QuantityOffDiscountProps) {
  const [quantityOff, setQuantityOff] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(1)

  const discountAmount = (quantityOff / totalQuantity) * sellingPrice
  const discountedPrice = sellingPrice - discountAmount
  const totalRevenue = discountedPrice * totalQuantity
  const totalCost = (sellingPrice - baseProfit) * totalQuantity
  const profitAfterDiscount = totalRevenue - totalCost
  const profitMargin = (profitAfterDiscount / totalRevenue) * 100

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity-off">Quantity Off</Label>
          <Input
            id="quantity-off"
            type="number"
            value={quantityOff}
            onChange={(e) => setQuantityOff(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="total-quantity">Total Quantity</Label>
          <Input
            id="total-quantity"
            type="number"
            value={totalQuantity}
            onChange={(e) => setTotalQuantity(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Discounted Price (per item):</p>
          <p>${discountedPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Total Revenue:</p>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Total Cost:</p>
          <p>${totalCost.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Profit After Discount:</p>
          <p>${profitAfterDiscount.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Profit Margin:</p>
          <p>{profitMargin.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  )
}

