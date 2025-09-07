import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        " placeholder-teal-50 bg-white/5 border-teal-300/50 text-white rounded-lg focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50  duration-300 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 selection:bg-teal-500 selection:text-white dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full border  px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:ring-red-300 dark:aria-invalid:ring-destructive/40 aria-invalid:border-red-300",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
