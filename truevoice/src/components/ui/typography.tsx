import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import React from "react"

/* --- Headings --- */
const headingVariants = cva("", {
  variants: {
    level: {
      h1: "text-[36px] sm:text-[42px] md:text-[50px] lg:text-[54px] xl:text-[60px] 2xl:text-[64px]",
      h3: "text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30px] xl:text-[34px] 2xl:text-[36px]",
      h4: "text-[18px] sm:text-[19px] md:text-[19px] lg:text-[20px] xl:text-[21px] 2xl:text-[22px]",
      h5: "text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] 2xl:text-[18px]",
      large:
        "text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px]",
      normal: "text-[14px] md:text-[16px]",
      medium: "text-[16px] md:text-[18px]",
       // using
      lg: "text-[24px]",
      pageheading:
        "text-[30px] md:text-[36px]",
        // using
      sectionheading:
        "text-[27px] md:text-[30px]",
        // using
      sectionheadingmd:
        "text-[42px] md:text-[48px]",
        // using
      sectionheadinglarge:
        "text-[30px] md:text-[36px]",
    },
  },
  defaultVariants: { level: "h1" },
})

type HeadingLevel = NonNullable<VariantProps<typeof headingVariants>["level"]>


const headingTagMap: Record<HeadingLevel, keyof React.JSX.IntrinsicElements & keyof HTMLElementTagNameMap> = {
  h1: "h1",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  large: "h2",
  lg: "h6",
  normal: "p",
  medium: "p",
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
      xxl: "text-[18px] md:text-[20px]",
      xl: "text-[18px]", // using
      large: "text-[16px]", // using
      normal: "text-[14px]",
      label: "text-[12px] md:text-[14px] font-[700]",
      btntext: "text-[14px] md:text-[16px] font-[500]",
      minibtntext: "text-[12px] md:text-[12px] font-[800]",
      sm: "text-[12px]", // using
    },
  },
  defaultVariants: { size: "label" },
})

interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof paragraphVariants> {
  children: React.ReactNode
}

export function Paragraph({
  className,
  size = "label",
  children,
  ...props
}: ParagraphProps) {
  return (
    <p className={cn(paragraphVariants({ size }), className)} {...props}>
      {children}
    </p>
  )
}
