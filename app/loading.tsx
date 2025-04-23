export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f5f2]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-amber-600/70 mb-4"></div>
        <div className="h-4 w-32 bg-amber-600/50 rounded mb-2"></div>
        <div className="h-3 w-24 bg-amber-600/30 rounded mb-4"></div>
        <p className="text-amber-800 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

