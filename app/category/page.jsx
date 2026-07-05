import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="page-container py-8">
      <div className="mb-6">
        <h1 className="text-gray-900 dark:text-white">Categories</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Browse all categories / সব ক্যাটাগরি দেখুন
        </p>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="card overflow-hidden">
            {/* Parent */}
            <Link
              href={`/category/${cat.slug}`}
              className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-4xl">{cat.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {cat.name}
                </p>
                {cat.namebn && (
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    {cat.namebn}
                  </p>
                )}
                {cat.description && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {cat.description}
                  </p>
                )}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            {/* Children grid */}
            {cat.children?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100 dark:border-gray-800">
                {cat.children.map((sub, i) => (
                  <Link
                    key={sub.id}
                    href={`/category/${sub.slug}`}
                    className={`flex items-center gap-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      i % 2 === 0
                        ? "border-r border-gray-100 dark:border-gray-800"
                        : ""
                    } ${
                      i < cat.children.length - 2
                        ? "border-b border-gray-100 dark:border-gray-800"
                        : ""
                    }`}
                  >
                    <span className="text-xl">{sub.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {sub.name}
                      </p>
                      {sub.namebn && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {sub.namebn}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
