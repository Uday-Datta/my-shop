"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          My Shop
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/cart" className="relative">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {session ? (
            <>
              <span className="text-sm text-gray-600">
                Hi, {session.user.name || session.user.email}
              </span>
              <Link href="/orders" className="text-sm">
                My Orders
              </Link>
              <button onClick={() => signOut()} className="text-sm underline">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm">
                Log in
              </Link>
              <Link href="/register" className="text-sm underline">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
