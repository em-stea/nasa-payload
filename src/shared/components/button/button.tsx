'use client'
import { VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { Spinner } from '@/shared/components/spinner/spinner'
import { buttonVariants } from '@/shared/styles/components/button'
import { cn } from '@/shared/utils/className-builder'

export type ButtonVariants = VariantProps<typeof buttonVariants>

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants & {
    asChild?: boolean
  }

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant,
  size,
  disabled,
  loading,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      aria-busy={loading ?? undefined}
      className={cn(buttonVariants({ variant, size, loading }), className)}
      disabled={disabled}
      {...props}
    >
      {loading ? <Spinner className="size-5" /> : children}
    </Comp>
  )
}
