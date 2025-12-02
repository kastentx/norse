import { ReactNode, Suspense } from "react";

export default function StoriesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              {/* Hero skeleton */}
              <div className="h-[70vh] min-h-[500px] bg-gray-200 dark:bg-gray-800 rounded-lg mb-12" />
              {/* Content skeletons */}
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
