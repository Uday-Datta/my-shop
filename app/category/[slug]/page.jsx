import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import CategoryProductGrid from "@/components/product/CategoryProductGrid";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} — My Shop`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: { orderBy: { name: "asc" } },
      parent: { include: { children: true } },
    },
  });

  if (!category) return notFound();

  // If this is a subcategory, get siblings from parent
  const siblings = category.parent?.children || [];

  // Get product count for this category and subcategories
  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const productCount = await prisma.product.count({
    where: { categoryId: { in: categoryIds } },
  });

  return (
    <div className="page-container py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/category"
          className="hover:text-gray-900 dark:hover:text-white"
        >
          Categories
        </Link>
        {category.parent && (
          <>
            <span>/</span>
            <Link
              href={`/category/${category.parent.slug}`}
              className="hover:text-gray-900 dark:hover:text-white"
            >
              {category.parent.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 dark:text-white font-medium">
          {category.name}
        </span>
      </nav>

      {/* Category header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl flex-shrink-0">
          {category.icon}
        </div>
        <div>
          <h1 className="text-gray-900 dark:text-white">{category.name}</h1>
          {category.namebn && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {category.namebn}
            </p>
          )}
          {category.description && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              {category.description}
            </p>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {productCount} product{productCount !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* Subcategory pills (if parent category) */}
      {category.children?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <Link
            href={`/category/${category.slug}`}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900"
          >
            All {category.name}
          </Link>
          {category.children.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${sub.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <span>{sub.icon}</span>
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Sibling pills (if subcategory) */}
      {siblings.length > 0 && category.parent && (
        <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
          <Link
            href={`/category/${category.parent.slug}`}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            All {category.parent.name}
          </Link>
          {siblings.map((sib) => (
            <Link
              key={sib.id}
              href={`/category/${sib.slug}`}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                sib.id === category.id
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>{sib.icon}</span>
              {sib.name}
            </Link>
          ))}
        </div>
      )}

      {/* Product grid with filters */}
      <CategoryProductGrid categorySlug={slug} />
    </div>
  );
}
