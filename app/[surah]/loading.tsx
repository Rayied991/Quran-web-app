export default function SurahLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      {/* Header skeleton */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/30 p-8 text-center space-y-3 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-48 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-32 mx-auto" />
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-full w-36 mx-auto mt-4" />
      </div>
      {/* Verse skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-3 animate-pulse">
          <div className="flex justify-between">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}