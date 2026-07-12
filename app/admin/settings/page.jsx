"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminSettingsPage() {
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setLogo(data.logo || ""));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logo }),
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white">Site Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your store's branding
        </p>
      </div>

      <div className="card p-6 max-w-md">
        <h3 className="text-gray-900 dark:text-white mb-4">Store Logo</h3>

        <ImageUpload value={logo} onChange={setLogo} />

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-lg mt-4">
            ✅ Logo updated successfully!
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary mt-4 flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Saving..." : "Save Logo"}
        </button>
      </div>
    </div>
  );
}
