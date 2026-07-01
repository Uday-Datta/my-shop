import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col p-6 gap-4">
        <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
        <Link href="/admin" className="hover:text-gray-300 text-sm">
          Dashboard
        </Link>
        <Link href="/admin/products" className="hover:text-gray-300 text-sm">
          Products
        </Link>
        <Link href="/admin/orders" className="hover:text-gray-300 text-sm">
          Orders
        </Link>
        <Link href="/" className="mt-auto hover:text-gray-300 text-sm">
          ← Back to Store
        </Link>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
