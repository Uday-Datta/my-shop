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

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setPlacing(true);
    setError("");

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

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b pb-6">
            <div className="w-20 h-20 relative bg-gray-100 rounded">
              <Image
                src={item.image || "https://placehold.co/100x100"}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-500">${item.price.toFixed(2)}</p>
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
              ${(item.price * item.quantity).toFixed(2)}
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

      <div className="mt-8 flex justify-between items-center text-xl font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={placing}
        className="w-full mt-6 bg-black text-white py-3 rounded hover:bg-gray-800 disabled:bg-gray-400"
      >
        {placing
          ? "Placing order..."
          : session
          ? "Checkout"
          : "Log in to Checkout"}
      </button>
    </main>
  );
}
