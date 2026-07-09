"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

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

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, parseInt(e.target.value) || 1)
              }
              className="w-16 border rounded px-2 py-1"
            />

            <p className="w-20 text-right font-semibold">
              ৳{(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 text-sm"
            >
              Remove
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
