import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Order placed!</h1>
      <p className="text-gray-600 mb-8">Thanks for your purchase. We're getting it ready.</p>
      <Link href="/" className="underline">Continue shopping</Link>
    </main>
  )
}