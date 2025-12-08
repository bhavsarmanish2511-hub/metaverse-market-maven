import { Button, ButtonProps } from "@/components/ui/button";
import { Power } from "lucide-react";

interface SignOutButtonProps extends ButtonProps {
  // You can add any other specific props you need, like onClick handlers
}

export function SignOutButton({ children, ...props }: SignOutButtonProps) {
  return (
    <Button variant="ghost" {...props}>
      <Power className="mr-2 h-4 w-4" />
      {children || "Sign Out"}
    </Button>
  );
}