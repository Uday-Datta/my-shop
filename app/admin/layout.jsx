import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col p-6 gap-1">
        <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
          Admin Panel
        </h2>
        {[
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/products", label: "Products" },
          { href: "/admin/categories", label: "Categories" },
          { href: "/admin/banners", label: "Banners" },
          { href: "/admin/orders", label: "Orders" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
          >
            {label}
          </Link>
        ))}
        <div className="mt-auto">
          <Link
            href="/"
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 flex items-center gap-2"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
