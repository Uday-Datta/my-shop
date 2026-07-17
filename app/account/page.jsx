"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ui/ImageUpload";
import Link from "next/link";

const STATUS_COLORS = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AccountPage() {
  const { status } = useSession();
  const router = useRouter();

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    phone: "",
    address: "",
    city: "",
  });
  const [stats, setStats] = useState({
    orderCount: 0,
    totalSpent: 0,
    createdAt: null,
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/account/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile({
            name: data.name || "",
            email: data.email || "",
            avatar: data.avatar || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
          });
          setStats({
            orderCount: data.orderCount || 0,
            totalSpent: data.totalSpent || 0,
            createdAt: data.createdAt,
          });
          setLoading(false);
        });
    }

    if (status === "authenticated") {
      fetch("/api/account/profile")
        .then((res) => res.json())
        .then((data) => {
          setProfile({
            name: data.name || "",
            email: data.email || "",
            avatar: data.avatar || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || "",
          });
          setStats({
            orderCount: data.orderCount || 0,
            totalSpent: data.totalSpent || 0,
            createdAt: data.createdAt,
          });
          setLoading(false);
        });

      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) =>
          setRecentOrders(Array.isArray(data) ? data.slice(0, 3) : [])
        )
        .catch(() => setRecentOrders([]));
    }
  }, [status, router]);

  const handleProfileSave = async () => {
    setSavingProfile(true);
    await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSavingProfile(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    const res = await fetch("/api/account/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    });
    const data = await res.json();
    setSavingPassword(false);

    if (!res.ok) {
      setPasswordError(data.error || "Failed to update password");
      return;
    }

    setPasswordSuccess(true);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  if (status === "loading" || loading) {
    return (
      <div className="page-container py-20 text-center">
        <div className="w-8 h-8 border-2 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const initials = (profile.name || profile.email || "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="page-container py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white dark:text-gray-900 text-xl font-bold">
              {initials}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-gray-900 dark:text-white">
            {profile.name || "My Account"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {profile.email}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.orderCount}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Orders Placed
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ৳{stats.totalSpent.toFixed(0)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Total Spent
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
            {stats.createdAt
              ? new Date(stats.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Member Since
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 dark:text-white">Recent Orders</h3>
          <Link
            href="/orders"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
            No orders yet
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href="/orders"
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" · "}৳{order.total.toFixed(2)}
                  </p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Profile section */}
      <div className="card p-6 mb-6">
        <h3 className="text-gray-900 dark:text-white mb-4">Profile</h3>

        <div className="mb-4">
          <label className="label block mb-1.5">Photo</label>
          <ImageUpload
            value={profile.avatar}
            onChange={(url) => setProfile({ ...profile, avatar: url })}
            endpoint="/api/account/upload-avatar"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label block mb-1.5">Name</label>
            <input
              type="text"
              className="w-full"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="label block mb-1.5">Email</label>
            <input
              type="email"
              disabled
              className="w-full opacity-60 cursor-not-allowed"
              value={profile.email}
            />
          </div>
          <div>
            <label className="label block mb-1.5">Phone</label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              className="w-full"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="label block mb-1.5">City</label>
            <input
              type="text"
              placeholder="Dhaka"
              className="w-full"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label block mb-1.5">Shipping Address</label>
            <textarea
              rows={2}
              placeholder="House, road, area..."
              className="w-full"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              This address is used automatically when you check out
            </p>
          </div>
        </div>

        {profileSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-lg mt-4">
            ✅ Profile updated!
          </div>
        )}

        <button
          onClick={handleProfileSave}
          disabled={savingProfile}
          className="btn-primary mt-4 flex items-center gap-2"
        >
          {savingProfile && (
            <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
          )}
          {savingProfile ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Password section */}
      <div className="card p-6 mb-6">
        <h3 className="text-gray-900 dark:text-white mb-4">Change Password</h3>

        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className="label block mb-1.5">Current Password</label>
            <input
              type="password"
              required
              className="w-full"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label block mb-1.5">New Password</label>
              <input
                type="password"
                required
                className="w-full"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="label block mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {passwordError && (
            <p className="text-sm text-red-500 dark:text-red-400">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-lg">
              ✅ Password updated!
            </div>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="btn-primary flex items-center gap-2"
          >
            {savingPassword && (
              <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
            )}
            {savingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <button
        onClick={() => signOut()}
        className="btn-secondary w-full sm:w-auto"
      >
        Log Out
      </button>
    </div>
  );
}
