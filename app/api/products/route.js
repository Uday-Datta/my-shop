import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const products = await prisma.product.findMany({
    where: {
      AND: [
        search ? { name: { contains: search, mode: "insensitive" } } : {},
        category ? { category } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
