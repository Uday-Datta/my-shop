import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function PUT(req, { params }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const data = await req.json();

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      namebn: data.namebn || null,
      slug: data.slug,
      description: data.description || null,
      icon: data.icon || null,
      parentId: data.parentId || null,
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(req, { params }) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
