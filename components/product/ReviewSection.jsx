"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import StarRating from "@/components/ui/StarRating";

export default function ReviewSection({ productId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 0, comment: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchReviews = async () => {
    const res = await fetch(`/api/reviews?productId=${productId}`);
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percent: reviews.length
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.rating === 0) {
      setError("Please select a star rating");
      return;
    }

    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, ...form }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Failed to submit review");
      return;
    }

    setSuccess(true);
    setShowForm(false);
    setForm({ rating: 0, comment: "" });
    fetchReviews();
    setTimeout(() => setSuccess(false), 3000);
  };

  const userReview = session
    ? reviews.find((r) => r.user?.email === session.user?.email)
    : null;

  return (
    <div className="mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-gray-900 dark:text-white">Customer Reviews</h2>
        {session ? (
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (userReview) {
                setForm({
                  rating: userReview.rating,
                  comment: userReview.comment,
                });
              }
            }}
            className="btn-primary"
          >
            {userReview ? "Edit Your Review" : "Write a Review"}
          </button>
        ) : (
          <Link href="/login" className="btn-secondary">
            Log in to review
          </Link>
        )}
      </div>

      {/* Rating summary */}
      {reviews.length > 0 && (
        <div className="card p-6 mb-8 flex flex-col sm:flex-row gap-8 items-start">
          {/* Average score */}
          <div className="text-center sm:border-r sm:border-gray-200 sm:dark:border-gray-700 sm:pr-8">
            <p className="text-6xl font-bold text-gray-900 dark:text-white">
              {averageRating}
            </p>
            <StarRating rating={Math.round(averageRating)} size="md" />
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Rating breakdown */}
          <div className="flex-1 space-y-2 w-full">
            {ratingCounts.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-4">
                  {star}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-yellow-400"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm text-gray-400 dark:text-gray-500 w-4">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-lg mb-6">
          ✅ Review submitted successfully!
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="text-gray-900 dark:text-white mb-6">
            {userReview ? "Update Your Review" : "Write a Review"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star selector */}
            <div>
              <label className="label block mb-2">Your Rating</label>
              <StarRating
                rating={form.rating}
                interactive
                size="lg"
                onChange={(value) => setForm({ ...form, rating: value })}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="label block mb-1.5">Your Review</label>
              <textarea
                required
                rows={4}
                placeholder="Share your experience with this product..."
                className="w-full"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ rating: 0, comment: "" });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/6" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 card">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="text-gray-900 dark:text-white mb-2">No reviews yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwn = session?.user?.email === review.user?.email;
            const initials = (review.user?.name || review.user?.email || "?")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={review.id}
                className={`card p-6 ${
                  isOwn
                    ? "ring-2 ring-gray-900 dark:ring-white ring-opacity-10"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                      <span className="text-white dark:text-gray-900 text-xs font-bold">
                        {initials}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {review.user?.name ||
                            review.user?.email?.split("@")[0]}
                        </p>
                        {isOwn && (
                          <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <StarRating rating={review.rating} size="sm" />
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
