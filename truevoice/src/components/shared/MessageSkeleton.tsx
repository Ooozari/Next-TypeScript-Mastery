

export default function MessageSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-teal-300/50 rounded-xl p-6 relative overflow-hidden shadow-md animate-pulse">
      {/* Delete Button Skeleton */}
      <div className="absolute top-2 right-2">
        <div className="h-5 w-5 bg-teal-300/20 rounded-full animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-teal-300/20 rounded animate-pulse" />
        <div className="h-5 w-5/6 bg-teal-300/20 rounded animate-pulse" />
        <div className="h-5 w-1/2 bg-teal-300/20 rounded animate-pulse" />
      </div>

      {/* Date Skeleton */}
      <div className="mt-3">
        <div className="h-4 w-1/3 bg-teal-300/20 rounded animate-pulse" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent pointer-events-none" />
    </div>
  );
}