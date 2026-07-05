import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { children: true, parent: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}

export async function POST(req) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  const category = await prisma.category.create({
    data: {
      name: data.name,
      namebn: data.namebn || null,
      slug: data.slug,
      description: data.description || null,
      icon: data.icon || null,
      parentId: data.parentId || null,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
