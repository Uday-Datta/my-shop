"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleDark = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="page-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Gokul Market <sup className="text-xs align-super rounded-full border-2 p-0.5">BD</sup>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-5">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth links */}
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                  Hi, {session.user.name || session.user.email}
                </span>
                <Link
                  href="/orders"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Orders
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="btn-secondary text-sm px-3 py-1.5"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm px-3 py-1.5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
