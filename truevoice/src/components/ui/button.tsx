import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none cursor-pointer disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105",
        destructive:
          "text-red-600 hover:text-red-500 transition-all duration-300 hover:scale-105",
        outline:
          "bg-transparent border-1 border-teal-400/80 text-teal-400/80 hover:bg-teal-500/30 border-teal-500 backdrop-blur-sm font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105",
        attractive: "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold",
        glassy: "border border-teal-200 bg-white/10 backdrop-blur-md border-teal-300/50 text-teal-200 hover:bg-teal-500/90 hover:text-white font-semibold py-2 px-4 md:px-6 md:py-3",
        dummy: "hover:bg-white/15 transition-all duration-300 hover:scale-105 bg-white/10 backdrop-blur-md border border-teal-200/50 text-teal-200 text-sm font-semibold rounded-full shadow-sm animate-pulse px-4 py-1.5",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3 py-1.5 md:px-4 md:py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
