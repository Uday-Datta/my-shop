"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={product.stock === 0}
      className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:bg-gray-300"
    >
      {product.stock === 0
        ? "Out of Stock"
        : added
        ? "✓ Added!"
        : "Add to Cart"}
    </button>
  );
}
