import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export type Discount = {
  id: string;
  type: "percentOff" | "amountOff" | "buyXGetY";
  value: number;
  buyX?: number;
  getY?: number;
  name: string;
};

interface DiscountManagerProps {
  discounts: Discount[];
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
}

export default function DiscountManager({
  discounts,
  setDiscounts,
}: DiscountManagerProps) {
  const [newDiscount, setNewDiscount] = useState<Discount>({
    id: "",
    type: "percentOff",
    value: 0,
    name: "",
  });

  const addDiscount = () => {
    if (newDiscount.name && newDiscount.value) {
      setDiscounts([
        ...discounts,
        { ...newDiscount, id: Date.now().toString() },
      ]);
      setNewDiscount({ id: "", type: "percentOff", value: 0, name: "" });
    }
  };

  const removeDiscount = (id: string) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id));
  };

  const updateDiscount = (
    id: string,
    field: string,
    value: string | number
  ) => {
    setDiscounts(
      discounts.map((discount) =>
        discount.id === id ? { ...discount, [field]: value } : discount
      )
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Manage Discounts</h3>
      <div className="space-y-4">
        <Select
          value={newDiscount.type}
          onValueChange={(value: "percentOff" | "amountOff" | "buyXGetY") =>
            setNewDiscount({ ...newDiscount, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select discount type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="percentOff">Percent Off</SelectItem>
            <SelectItem value="amountOff">Amount Off</SelectItem>
            <SelectItem value="buyXGetY">Buy X Get Y</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Discount Name"
          value={newDiscount.name}
          onChange={(e) =>
            setNewDiscount({ ...newDiscount, name: e.target.value })
          }
        />
        <Input
          type="number"
          placeholder="Discount Value"
          value={newDiscount.value}
          onChange={(e) =>
            setNewDiscount({ ...newDiscount, value: Number(e.target.value) })
          }
        />
        {newDiscount.type === "buyXGetY" && (
          <>
            <Input
              type="number"
              placeholder="Buy X"
              value={newDiscount.buyX || ""}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, buyX: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Get Y"
              value={newDiscount.getY || ""}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, getY: Number(e.target.value) })
              }
            />
          </>
        )}
        <Button onClick={addDiscount}>Add Discount</Button>
      </div>
      <div className="space-y-4">
        {discounts.map((discount) => (
          <div key={discount.id} className="flex items-center space-x-2">
            <Input
              value={discount.name}
              onChange={(e) =>
                updateDiscount(discount.id, "name", e.target.value)
              }
            />
            <Input
              type="number"
              value={discount.value}
              onChange={(e) =>
                updateDiscount(discount.id, "value", Number(e.target.value))
              }
            />
            {discount.type === "buyXGetY" && (
              <>
                <Input
                  type="number"
                  value={discount.buyX}
                  onChange={(e) =>
                    updateDiscount(discount.id, "buyX", Number(e.target.value))
                  }
                />
                <Input
                  type="number"
                  value={discount.getY}
                  onChange={(e) =>
                    updateDiscount(discount.id, "getY", Number(e.target.value))
                  }
                />
              </>
            )}
            <Button
              variant="destructive"
              onClick={() => removeDiscount(discount.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
