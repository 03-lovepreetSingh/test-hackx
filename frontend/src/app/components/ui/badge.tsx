import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/80',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      live: 'bg-green-500/20 text-green-500 border border-green-500/50',
      voting: 'bg-blue-500/20 text-blue-500 border border-blue-500/50',
      ended: 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
export function Badge({
  className,
  variant,
  ...props
}: BadgeProps) {
  return <div className={cn(badgeVariants({
    variant
  }), className)} {...props} />;
}