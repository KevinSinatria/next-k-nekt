import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-8">
      {/* Header Placeholder */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Cards Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4"
          >
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        ))}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4 md:col-span-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
