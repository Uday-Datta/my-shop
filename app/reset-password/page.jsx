"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  if (!token) {
    return (
      <div className="card w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-gray-900 dark:text-white mb-2">Invalid link</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password" className="btn-primary">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="card w-full max-w-md p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-gray-900 dark:text-white mb-2">Password reset!</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Redirecting you to login...
        </p>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-md p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white">Reset your password</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Choose a new password for your account
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label block mb-1.5">New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="label block mb-1.5">Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            className="w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
