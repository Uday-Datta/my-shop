export default function ProductDetailLoading() {
  return (
    <div className="page-container py-6 md:py-10 animate-pulse">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
          <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-5/6" />
          <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded w-40 mt-6" />
        </div>
      </div>
    </div>
  );
}
