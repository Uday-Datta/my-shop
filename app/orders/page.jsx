"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const STATUS_CONFIG = {
  PENDING: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: "🕐",
    description: "Order received, awaiting processing",
  },
  PAID: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: "✅",
    description: "Payment confirmed",
  },
  SHIPPED: {
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    icon: "🚚",
    description: "Your order is on the way",
  },
  DELIVERED: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: "📦",
    description: "Order delivered successfully",
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: "❌",
    description: "Order was cancelled",
  },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/orders")
        .then(async (res) => {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            setOrders(Array.isArray(data) ? data : []);
          } catch (e) {
            setOrders([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setOrders([]);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="page-container py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="page-container py-20 text-center">
        <div className="text-6xl mb-6">🛍️</div>
        <h2 className="text-gray-900 dark:text-white mb-3">No orders yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Looks like you haven't placed any orders yet.
        </p>
        <Link href="/" className="btn-primary px-8 py-3">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white">My Orders</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="card overflow-hidden">
              {/* Order header */}
              <div
                className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Status icon */}
                  <div className="text-2xl">{config.icon}</div>

                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <span className={`badge ${config.color}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {config.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:text-right">
                  <div>
                    <p className="label">Date</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="label">Total</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                      ৳{order.total.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="label">Items</p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">
                      {order.items?.length || 0}
                    </p>
                  </div>

                  {/* Expand arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Expandable order items */}
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-800">
                  {/* Progress tracker */}
                  {order.status !== "CANCELLED" && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between relative">
                        {/* Progress line */}
                        <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />
                        <div
                          className="absolute left-0 top-3 h-0.5 bg-gray-900 dark:bg-white z-0 transition-all duration-500"
                          style={{
                            width:
                              order.status === "PENDING"
                                ? "0%"
                                : order.status === "PAID"
                                ? "33%"
                                : order.status === "SHIPPED"
                                ? "66%"
                                : "100%",
                          }}
                        />

                        {["PENDING", "PAID", "SHIPPED", "DELIVERED"].map(
                          (step) => {
                            const steps = [
                              "PENDING",
                              "PAID",
                              "SHIPPED",
                              "DELIVERED",
                            ];
                            const currentIndex = steps.indexOf(order.status);
                            const stepIndex = steps.indexOf(step);
                            const isDone = stepIndex <= currentIndex;

                            return (
                              <div
                                key={step}
                                className="flex flex-col items-center z-10 gap-1"
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                    isDone
                                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                                  }`}
                                >
                                  {isDone ? "✓" : ""}
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                  {step.toLowerCase()}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 px-6 py-4"
                      >
                        <div className="w-16 h-16 relative bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                          <Image
                            src={
                              item.product?.image ||
                              "https://placehold.co/100x100"
                            }
                            alt={item.product?.name || "Product"}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                            {item.product?.category}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Qty: {item.quantity} × ৳{item.price.toFixed(2)}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <Link href="/" className="btn-secondary text-sm px-4 py-2">
                      Shop More
                    </Link>
                    <div className="text-right">
                      <p className="label">Order Total</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                        ৳{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
