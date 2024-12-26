import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export type SubmitButtonProps = {
  isPending: boolean;
} & ButtonProps;

export const SubmitButton = ({ isPending, ...props }: SubmitButtonProps) => {
  return (
    <Button {...props} disabled={isPending} className="min-w-32">
      {isPending ? <Loader2 className="size-4 animate-spin" /> : props.children}
    </Button>
  );
};
