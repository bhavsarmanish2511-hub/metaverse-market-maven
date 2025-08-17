import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cyberCardVariants = cva(
  "rounded-lg border transition-all duration-300",
  {
    variants: {
      variant: {
        glass: "glass hover:border-glass-border/40 hover:shadow-cyber",
        solid: "bg-card text-card-foreground border-border hover:shadow-cyber",
        hologram: "hologram-border bg-gradient-surface text-foreground hover:shadow-neon",
        neon: "bg-card/50 border-secondary/30 hover:border-secondary/60 hover:shadow-neon backdrop-blur-sm",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "glass",
      padding: "default",
    },
  }
)

export interface CyberCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cyberCardVariants> {}

const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cyberCardVariants({ variant, padding, className }))}
      {...props}
    />
  )
)
CyberCard.displayName = "CyberCard"

const CyberCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CyberCardHeader.displayName = "CyberCardHeader"

const CyberCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight holographic", className)}
    {...props}
  />
))
CyberCardTitle.displayName = "CyberCardTitle"

const CyberCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CyberCardDescription.displayName = "CyberCardDescription"

const CyberCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
CyberCardContent.displayName = "CyberCardContent"

const CyberCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0", className)}
    {...props}
  />
))
CyberCardFooter.displayName = "CyberCardFooter"

export { 
  CyberCard, 
  CyberCardHeader, 
  CyberCardFooter, 
  CyberCardTitle, 
  CyberCardDescription, 
  CyberCardContent,
  cyberCardVariants 
}