export default function ProfileLinkSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 animate-pulse">
      <div className="text-sm font-medium block mb-2 h-4 w-1/3 bg-teal-300/20 rounded"></div>
      <div className="flex space-x-2">
        <div className="flex-1 h-10 bg-teal-300/20 border border-white/30 rounded-lg"></div>
        <div className="h-10 w-10 bg-teal-300/20 rounded-md"></div>
      </div>
    </div>
  );
}