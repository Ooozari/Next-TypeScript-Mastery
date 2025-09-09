export default function ToggleSwitchSkeleton() {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 flex items-center justify-between animate-pulse">
      <div className="flex items-center space-x-2 w-full">
        <div className="w-10 h-5 bg-teal-300/20 rounded-full"></div>
        <div className="h-4 w-full bg-teal-300/20 rounded"></div>
      </div>
      <div className="h-4 w-1/4 bg-teal-300/20 rounded md:block hidden"></div>
    </div>
  );
}