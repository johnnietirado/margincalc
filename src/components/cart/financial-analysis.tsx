import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/contexts/cart-context";
import { useState } from "react";

type NewCost = {
  name: string;
  type: "fixed" | "percentage";
  value: number;
  note?: string;
};

export function FinancialAnalysis() {
  const {
    subtotal,
    discountedTotal,
    totalRevenue,
    totalCost,
    grossProfit,
    absorbedShippingCost,
    offerFreeShipping,
    freeShippingThreshold,
    profitMargin,
    totalProductionCost,
    additionalCosts,
    additionalCostsTotal,
    addAdditionalCost,
    removeAdditionalCost,
  } = useCart();

  const [newCost, setNewCost] = useState<NewCost>({
    name: "",
    type: "fixed",
    value: 0,
    note: "",
  });

  const handleAddCost = () => {
    if (newCost.name && newCost.value > 0) {
      addAdditionalCost(newCost);
      setNewCost({
        name: "",
        type: "fixed",
        value: 0,
        note: "",
      });
    }
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Financial Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="font-medium text-lg">${totalRevenue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Production Cost
              </p>
              <p className="font-medium text-lg">
                ${totalProductionCost.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Order Cost</p>
              <p className="font-medium text-lg">${totalCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gross Profit</p>
              <p className="font-medium text-lg">${grossProfit.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className="font-medium text-lg">{profitMargin.toFixed(2)}%</p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Discount Impact</p>
              <p className="font-medium text-lg text-red-600">
                -${(subtotal - discountedTotal).toFixed(2)}{" "}
                <span className="text-sm">
                  (
                  {subtotal > 0
                    ? (((subtotal - discountedTotal) / subtotal) * 100).toFixed(
                        2
                      )
                    : "0.00"}
                  %)
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shipping Impact</p>
              <p className="font-medium text-lg">
                ${absorbedShippingCost.toFixed(2)}{" "}
                {offerFreeShipping && subtotal >= freeShippingThreshold && (
                  <span className="text-sm text-red-600">(Free)</span>
                )}
              </p>
            </div>

            {/* Additional Costs Section */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-medium">Additional Costs</p>
                <p className="text-sm font-medium">
                  Total: ${additionalCostsTotal.toFixed(2)}
                </p>
              </div>

              {/* Add New Cost Form */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <Input
                  placeholder="Name"
                  value={newCost.name}
                  onChange={(e) =>
                    setNewCost({ ...newCost, name: e.target.value })
                  }
                />
                <Select
                  value={newCost.type}
                  onValueChange={(value: "fixed" | "percentage") =>
                    setNewCost({ ...newCost, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step={newCost.type === "fixed" ? "0.01" : "0.1"}
                  placeholder={
                    newCost.type === "fixed" ? "Amount" : "Percentage"
                  }
                  value={newCost.value || ""}
                  onChange={(e) =>
                    setNewCost({ ...newCost, value: Number(e.target.value) })
                  }
                />
                <Button onClick={handleAddCost}>Add</Button>
              </div>
              <Input
                placeholder="Note (optional)"
                value={newCost.note}
                onChange={(e) =>
                  setNewCost({ ...newCost, note: e.target.value })
                }
                className="mb-4"
              />

              {/* List of Additional Costs */}
              <div className="space-y-2">
                {additionalCosts.map((cost) => (
                  <div
                    key={cost.id}
                    className="flex items-center justify-between bg-background/50 p-2 rounded"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{cost.name}</p>
                      {cost.note && (
                        <p className="text-sm text-muted-foreground">
                          {cost.note}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm">
                        {cost.type === "fixed"
                          ? `$${cost.value.toFixed(2)}`
                          : `${cost.value.toFixed(1)}%`}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAdditionalCost(cost.id)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
