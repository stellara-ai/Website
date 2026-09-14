import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const actionVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-brand-foreground hover:brightness-110 shadow-[0_6px_16px_-4px_rgba(97,97,255,0.5)]",
        ink: "bg-foreground text-background hover:opacity-90",
        outline:
          "border-2 border-foreground/15 bg-transparent text-foreground hover:border-brand hover:text-brand",
        "outline-ink":
          "border-2 border-white/25 bg-transparent text-ink-foreground hover:border-white hover:bg-white/5",
        white: "bg-white text-[#292f4c] hover:bg-white/90 shadow-soft",
        ghost: "text-foreground hover:bg-muted",
        subtle: "bg-muted text-foreground hover:bg-accent",
        link: "text-brand underline-offset-4 hover:underline px-0 rounded-none",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-[3.25rem] px-7 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export type ActionVariantProps = VariantProps<typeof actionVariants>

export function actionClasses(props: ActionVariantProps & { className?: string }) {
  const { variant, size, className } = props
  return cn(actionVariants({ variant, size }), className)
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & ActionVariantProps

export function ActionButton({ className, variant, size, ...props }: ButtonProps) {
  return <button className={actionClasses({ variant, size, className })} {...props} />
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & ActionVariantProps

export function ActionLink({ className, variant, size, ...props }: LinkProps) {
  return <a className={actionClasses({ variant, size, className })} {...props} />
}
