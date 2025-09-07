import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder-teal-50 bg-white/5 border-teal-300/50 text-white rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50  duration-300  placeholder:capitalize dark:bg-input/30  flex h-9 w-full min-w-0 selection:bg-teal-500 selection:text-white border  px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-300 dark:aria-invalid:ring-destructive/40 aria-invalid:border-red-300",
        className
      )}
      {...props}
    />
  )
}

export { Input }
