"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-gray-900 dark:text-white mb-2">
              Check your email
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              If an account exists for{" "}
              <span className="font-medium">{email}</span>, we've sent a
              password reset link. It expires in 1 hour.
            </p>
            <Link href="/login" className="btn-secondary mt-6 inline-block">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-gray-900 dark:text-white">
                Forgot password?
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label block mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 mt-2 flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ← Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
