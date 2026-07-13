import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Icon() {
  const settings = await prisma.siteSettings.findFirst();

  if (settings?.favicon) {
    try {
      const res = await fetch(settings.favicon);
      const buffer = await res.arrayBuffer();
      return new Response(buffer, {
        headers: {
          "Content-Type": res.headers.get("content-type") || "image/png",
        },
      });
    } catch (error) {
      console.error("Favicon fetch error:", error);
    }
  }

  const fallback = await readFile(
    path.join(process.cwd(), "public", "default-icon.png")
  );
  return new Response(fallback, { headers: { "Content-Type": "image/png" } });
}
