import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">❌</div>
      <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
      <p className="text-gray-600 mb-8">
        Something went wrong with your payment. Your order has been cancelled.
      </p>
      <Link
        href="/cart"
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
      >
        Back to Cart
      </Link>
    </main>
  );
}
