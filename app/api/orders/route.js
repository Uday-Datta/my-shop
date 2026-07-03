import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch orders for the logged in customer
export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

// POST — place a new order (cash on delivery)
export async function POST(req) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { items, total } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
