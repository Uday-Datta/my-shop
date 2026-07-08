import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function GET() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ type: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(banners);
}

export async function POST(req) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const banner = await prisma.banner.create({ data });
  return NextResponse.json(banner, { status: 201 });
}
