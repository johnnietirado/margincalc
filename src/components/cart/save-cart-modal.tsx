import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CartItem } from "@/lib/types/cart";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";

interface SaveCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discounts: any[];
}

const getDefaultName = (cart: CartItem[]) => {
  return cart.map((item) => `${item.name} x${item.quantity}`).join(", ");
};

export function SaveCartModal({
  isOpen,
  onClose,
  cart,
  discounts,
}: SaveCartModalProps) {
  const createCart = useMutation(api.carts.create);
  const [name, setName] = useState(getDefaultName(cart));
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await createCart({
        name,
        description: description || undefined,
        products: cart.map((item) => ({
          productId: item.id as Id<"products">,
          priceValue: item.sellingPrice,
          priceAlias: item.name,
          quantity: item.quantity,
        })),
        discounts: discounts.map((discount) => ({
          name: discount.name,
          type: discount.type,
          value: discount.value,
          buyX: discount.buyX,
          getY: discount.getY,
        })),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setName(getDefaultName(cart));
    }
  }, [isOpen, cart]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Cart</DialogTitle>
          <DialogDescription>
            Save your current cart configuration for later use.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Cart name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your cart..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name || isSaving}>
            {isSaving ? "Saving..." : "Save Cart"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
