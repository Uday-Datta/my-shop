import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const banners = await prisma.banner.findMany({
    where: {
      active: true,
      ...(type ? { type } : {}),
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(banners);
}
