import Link from "next/link";

export default function CategoryNotFound() {
  return (
    <div className="page-container py-20 text-center">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-gray-900 dark:text-white mb-3">Category not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        This category doesn't exist or has been removed.
      </p>
      <Link href="/category" className="btn-primary px-8 py-3">
        Browse All Categories
      </Link>
    </div>
  );
}
