import { cn } from '../../../lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-2xl glass-card border border-white/5 h-full space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="p-6 rounded-2xl glass-card border border-white/5 space-y-4">
      <Skeleton className="h-8 w-48 mb-6" />
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <div className="space-y-2 w-24">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
