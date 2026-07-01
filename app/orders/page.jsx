"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">
        Loading your orders...
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
        <Link href="/" className="underline">
          Start shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            {/* Order header */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Order placed</p>
                <p className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  STATUS_COLORS[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order items */}
            <div className="divide-y">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 px-6 py-4 items-center"
                >
                  <div className="w-16 h-16 relative bg-gray-100 rounded flex-shrink-0">
                    <Image
                      src={item.product.image || "https://placehold.co/100x100"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
