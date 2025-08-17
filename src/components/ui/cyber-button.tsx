import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cyberButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        cyber: "bg-gradient-cyber text-primary-foreground hover:shadow-cyber hover:scale-105 border border-primary/30",
        hologram: "bg-gradient-hologram text-background hover:shadow-neon hover:scale-105 border border-secondary/30",
        glass: "glass text-foreground hover:bg-glass/60 hover:border-glass-border/40 hover:shadow-cyber",
        neon: "bg-secondary text-secondary-foreground hover:shadow-neon hover:scale-105 border border-secondary/50",
        accent: "bg-accent text-accent-foreground hover:shadow-accent hover:scale-105 border border-accent/50",
        outline: "border border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:shadow-cyber",
        ghost: "hover:bg-glass/20 hover:text-primary text-muted-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "cyber",
      size: "default",
    },
  }
)

export interface CyberButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cyberButtonVariants> {
  asChild?: boolean
}

const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(cyberButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
CyberButton.displayName = "CyberButton"

export { CyberButton, cyberButtonVariants }