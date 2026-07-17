import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBkashToken } from "@/lib/bkash";

export async function POST(req) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const body = await req.json();
  console.log("BKASH REQUEST BODY:", body);

  const { items, total } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  if (!total) {
    return NextResponse.json({ error: "Total is missing" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "PENDING",
        shippingAddress: user?.address || null,
        shippingCity: user?.city || null,
        shippingPhone: user?.phone || null,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    const token = await getBkashToken();

    const res = await fetch(process.env.BKASH_CREATE_PAYMENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token,
        "x-app-key": process.env.BKASH_API_KEY,
      },
      body: JSON.stringify({
        mode: "0011",
        payerReference: session.user.id,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/bkash/callback?orderId=${order.id}`,
        amount: String(total.toFixed(2)),
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: order.id,
      }),
    });

    const data = await res.json();
    console.log("BKASH CREATE RESPONSE:", data);

    if (data?.bkashURL) {
      return NextResponse.json({ bkashURL: data.bkashURL });
    } else {
      // Rollback order if bKash fails
      await prisma.order.delete({ where: { id: order.id } });
      return NextResponse.json(
        { error: data?.statusMessage || "Failed to initiate bKash payment" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("bKash error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
