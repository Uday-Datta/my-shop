import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBkashToken } from "@/lib/bkash";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (status === "cancel") {
    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.redirect(`${appUrl}/cart`);
  }

  if (status === "failure") {
    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.redirect(`${appUrl}/cart/failed`);
  }

  // Execute the payment
  try {
    const token = await getBkashToken();

    const res = await fetch(process.env.BKASH_EXECUTE_PAYMENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token,
        "x-app-key": process.env.BKASH_API_KEY,
      },
      body: JSON.stringify({ paymentID }),
    });

    const data = await res.json();

    if (data?.transactionStatus === "Completed") {
      // Payment successful — update order to PAID
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });

      // Reduce stock
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return NextResponse.redirect(`${appUrl}/cart/success`);
    } else {
      await prisma.order.delete({ where: { id: orderId } });
      return NextResponse.redirect(`${appUrl}/cart/failed`);
    }
  } catch (error) {
    console.error("bKash execute error:", error);
    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.redirect(`${appUrl}/cart/failed`);
  }
}
