"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [logo, setLogo] = useState("");
  const [favicon, setFavicon] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSiteName(data.siteName || "");
        setTagline(data.tagline || "");
        setLogo(data.logo || "");
        setFavicon(data.favicon || "");
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteName, tagline, logo, favicon }),
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

      <div className="card p-6 max-w-md mb-6">
        <h3 className="text-gray-900 dark:text-white mb-4">
          Site Name & Tagline
        </h3>

        <div className="space-y-4">
          <div>
            <label className="label block mb-1.5">Site Name</label>
            <input
              type="text"
              placeholder="Kinbo"
              className="w-full"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Shown in the browser tab and search results
            </p>
          </div>

          <div>
            <label className="label block mb-1.5">Tagline / Description</label>
            <input
              type="text"
              placeholder="Fashion & lifestyle, delivered across Bangladesh"
              className="w-full"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card p-6 max-w-md mb-6">
        <h3 className="text-gray-900 dark:text-white mb-1">Store Logo</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Wide logo shown in the navbar. Icon + wordmark works best.
        </p>
        <ImageUpload value={logo} onChange={setLogo} />
      </div>

      <div className="card p-6 max-w-md">
        <h3 className="text-gray-900 dark:text-white mb-1">Favicon</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Square icon shown in the browser tab.
        </p>
        <ImageUpload value={favicon} onChange={setFavicon} />
      </div>

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm px-4 py-3 rounded-lg mt-4 max-w-md">
          ✅ Settings updated successfully!
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
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
