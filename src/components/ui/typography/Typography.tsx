import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';

const typographyVariants = cva('text-content-primary', {
  variants: {
    variant: {
      display: 'text-5xl font-bold tracking-tighter sm:text-6xl text-gradient',
      h1: 'text-4xl font-bold tracking-tight',
      h2: 'text-3xl font-semibold tracking-tight',
      h3: 'text-2xl font-semibold tracking-tight',
      body: 'text-base font-normal',
      caption: 'text-sm text-content-secondary',
      label: 'text-xs font-medium uppercase tracking-wider text-content-muted',
    },
    weight: {
      light: 'font-light',
      regular: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
    },
    align: { left: 'text-left', center: 'text-center', right: 'text-right' },
  },
  defaultVariants: {
    variant: 'body',
  },
});

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>, VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, weight, align, as, children, ...props }, ref) => {
    const Component = as || (variant?.startsWith('h') ? variant : 'p');
    return React.createElement(
      Component,
      { ref, className: cn(typographyVariants({ variant, weight, align, className }), className), ...props },
      children
    );
  }
);
Typography.displayName = 'Typography';
