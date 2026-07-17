"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [hasAddress, setHasAddress] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/account/profile")
        .then((res) => res.json())
        .then((data) => setHasAddress(!!data.address));
    }
  }, [session]);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setPlacing(true);
    setError("");

    if (paymentMethod === "cod") {
      // Cash on delivery — save order directly
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      });

      setPlacing(false);

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Checkout failed");
        return;
      }

      clearCart();
      router.push("/cart/success");
    } else {
      // bKash payment
      const res = await fetch("/api/bkash/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, total }),
      });

      const data = await res.json();
      setPlacing(false);

      if (!res.ok) {
        setError(data.error || "bKash checkout failed");
        return;
      }

      clearCart();
      window.location.href = data.bkashURL;
    }
  };

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/" className="underline">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

      {/* Cart items */}
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b pb-6">
            <div className="w-20 h-20 relative bg-gray-100 rounded flex-shrink-0">
              <Image
                src={item.image || "https://placehold.co/100x100"}
                alt={item.name}
                fill
                sizes="80px"
                className="object-cover rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-500">৳{item.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                type="button"
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
                className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-l-lg"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium text-gray-900 dark:text-white">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-lg"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-semibold">
              ৳{(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeFromCart(item.id)}
              className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Remove item"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-8 flex justify-between items-center text-xl font-bold border-t pt-6">
        <span>Total</span>
        <span>৳{total.toFixed(2)}</span>
      </div>

      {/* Payment method selection */}
      <div className="mt-8">
        <h2 className="font-semibold mb-4">Select Payment Method</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Cash on Delivery */}
          <button
            onClick={() => setPaymentMethod("cod")}
            className={`border-2 rounded-lg p-4 text-left transition-all ${
              paymentMethod === "cod"
                ? "border-black bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-2">🚚</div>
            <p className="font-semibold">Cash on Delivery</p>
            <p className="text-sm text-gray-500 mt-1">
              Pay when your order arrives
            </p>
          </button>

          {/* bKash */}
          <button
            onClick={() => setPaymentMethod("bkash")}
            className={`border-2 rounded-lg p-4 text-left transition-all ${
              paymentMethod === "bkash"
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-2">📱</div>
            <p className="font-semibold text-pink-600">Pay with bKash</p>
            <p className="text-sm text-gray-500 mt-1">
              Fast and secure mobile payment
            </p>
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {session && !hasAddress && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 text-sm px-4 py-3 rounded-lg mt-4 flex items-center justify-between gap-3">
          <span>Add a shipping address for faster delivery</span>
          <Link
            href="/account"
            className="underline font-medium whitespace-nowrap"
          >
            Add now
          </Link>
        </div>
      )}

      {/* Checkout button */}
      <button
        onClick={handleCheckout}
        disabled={placing}
        className={`w-full mt-6 py-3 rounded text-white font-semibold disabled:opacity-50 transition-colors ${
          paymentMethod === "bkash"
            ? "bg-pink-600 hover:bg-pink-700"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {placing
          ? "Processing..."
          : !session
          ? "Log in to Checkout"
          : paymentMethod === "bkash"
          ? "Pay with bKash"
          : "Place Order (Cash on Delivery)"}
      </button>
    </main>
  );
}
