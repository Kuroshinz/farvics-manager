import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-galaxy-pink/50 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-content-primary text-background hover:bg-content-primary/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]',
        primary: 'bg-galaxy-red text-white hover:bg-galaxy-red/90 shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)]',
        outline: 'border border-white/10 bg-transparent hover:bg-white/5 text-content-primary',
        ghost: 'hover:bg-white/10 text-content-secondary hover:text-content-primary',
        glass: 'glass-card text-content-primary',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
