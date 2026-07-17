import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      avatar: true,
      phone: true,
      address: true,
      city: true,
      createdAt: true,
    },
  });

  const orderStats = await prisma.order.aggregate({
    where: { userId: session.user.id, status: { not: "CANCELLED" } },
    _count: true,
    _sum: { total: true },
  });

  return NextResponse.json({
    ...user,
    orderCount: orderStats._count,
    totalSpent: orderStats._sum.total || 0,
  });
}

export async function PUT(req) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const { name, avatar, phone, address, city } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, avatar, phone, address, city },
  });

  return NextResponse.json({ success: true });
}
