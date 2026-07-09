import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, recentOrders] = await Promise.all(
    [
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
    ]
  );

  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELLED" } },
  });

  const stats = [
    {
      label: "Total Products",
      value: productCount,
      href: "/admin/products",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Orders",
      value: orderCount,
      href: "/admin/orders",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Total Users",
      value: userCount,
      href: "#",
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Revenue",
      value: `৳${(revenue._sum.total || 0).toFixed(2)}`,
      href: "#",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

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

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          Welcome back! Here's what's happening in your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            <p className="label">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-gray-900 dark:text-white">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            View all →
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-6 py-3">Customer</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Total</th>
              <th className="text-left px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentOrders.map((order) => (
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
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
