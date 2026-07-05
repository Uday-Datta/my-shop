import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  // Find category by slug if provided
  let categoryFilter = {};
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { children: true },
    });

    if (category) {
      // Include products from this category AND all its subcategories
      const categoryIds = [category.id, ...category.children.map((c) => c.id)];
      categoryFilter = { categoryId: { in: categoryIds } };
    }
  }

  // Sort order
  const orderBy =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where: {
      AND: [
        search ? { name: { contains: search, mode: "insensitive" } } : {},
        categoryFilter,
      ],
    },
    include: {
      reviews: { select: { rating: true } },
      category: { select: { name: true, namebn: true, slug: true } },
    },
    orderBy,
  });

  const productsWithRating = products.map((p) => ({
    ...p,
    averageRating: p.reviews.length
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0,
    reviewCount: p.reviews.length,
  }));

  return NextResponse.json(productsWithRating);
}
