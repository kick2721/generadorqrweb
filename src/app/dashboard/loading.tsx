export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64" />
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-36" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
      </div>
    </div>
  );
}
