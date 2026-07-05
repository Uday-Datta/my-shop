"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { data: session } = useSession();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  const tabs = [
    {
      href: "/",
      label: "Home",
      labelbn: "হোম",
      icon: (active) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      href: "/category",
      label: "Categories",
      labelbn: "ক্যাটাগরি",
      icon: (active) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      href: "/cart",
      label: "Cart",
      labelbn: "কার্ট",
      badge: itemCount,
      icon: (active) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      href: "/orders",
      label: "Orders",
      labelbn: "অর্ডার",
      icon: (active) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      href: session ? "/account" : "/login",
      label: session ? "Account" : "Login",
      labelbn: session ? "অ্যাকাউন্ট" : "লগইন",
      icon: (active) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill={active ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={active ? 0 : 1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[56px] transition-colors ${
                active
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-900 dark:bg-white rounded-full" />
              )}

              {/* Badge */}
              {tab.badge > 0 && (
                <span className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {tab.badge > 9 ? "9+" : tab.badge}
                </span>
              )}

              {tab.icon(active)}

              <span className="text-xs font-medium leading-none">
                {tab.label}
              </span>
              <span
                className="text-xs leading-none"
                style={{ fontSize: "9px", opacity: 0.6 }}
              >
                {tab.labelbn}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
