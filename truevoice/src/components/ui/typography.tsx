import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

/* --- Headings --- */
const headingVariants = cva("", {
  variants: {
    level: {
      h1: "text-[36px] sm:text-[42px] md:text-[50px] lg:text-[54px] xl:text-[60px] 2xl:text-[64px]",
       // using
      lg: "text-[20px]",
      pageheading:
        "text-[28px] sm:text-[30px] md:text-[36px]",
        // using
      sectionheading:
        "text-[22px] sm:text-[24px] md:text-[30px]",
        // using
      sectionheadingmd:
        "text-[36px] sm:text-[40px] md:text-[48px]",
        // using
      sectionheadinglarge:
        "text-[22px] sm:text-[26px] md:text-[36px]",
    },
  },
  defaultVariants: { level: "h1" },
})

type HeadingLevel = NonNullable<VariantProps<typeof headingVariants>["level"]>


const headingTagMap: Record<HeadingLevel, keyof React.JSX.IntrinsicElements & keyof HTMLElementTagNameMap> = {
  h1: "h1",
  lg: "h1",
  pageheading: "h1",
  sectionheading: "h3",
  sectionheadinglarge: "h2",
  sectionheadingmd: "h2",
}

interface HeadingProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headingVariants> {
  children: React.ReactNode
}


export function Heading({
  className,
  level = "h1",
  children,
  ...props
}: HeadingProps) {
  
  const Tag = headingTagMap[level as HeadingLevel] || "p"
  return (
    <Tag className={cn(headingVariants({ level }), className)} {...props}>
      {children}
    </Tag>
  )
}

/* --- Paragraph --- */
const paragraphVariants = cva("", {
  variants: {
    size: {
      xxl: "text-[16px] sm:text-[18px] md:text-[20px]",
      xl: "text-[14px] sm:text-[16px] md:text-[18px]", // using
      large: "text-[14px] md:text-[16px]", // using
      normal: "text-[12px] md:text-[14px]",
      sm: "text-[12px]", // using
    },
  },
  defaultVariants: { size: "normal" },
})

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {
  children: React.ReactNode
}

export function Paragraph({
  className,
  size = "normal",
  children,
  ...props
}: ParagraphProps) {
  return (
    <p className={cn(paragraphVariants({ size }), className)} {...props}>
      {children}
    </p>
  )
}
