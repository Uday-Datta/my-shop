"use client";

import { useState, useEffect } from "react";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_COLORS = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white">Orders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {orders.length} total order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            No orders yet.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Items</th>
                <th className="text-left px-6 py-4">Total</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {order.user?.name || "No name"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {order.user?.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {new Date(order.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {order.items?.length || 0} item
                    {order.items?.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer border-0 outline-none ring-0 ${
                        STATUS_COLORS[order.status]
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
