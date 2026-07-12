import { Inter } from "next/font/google";
import AuthProvider from "@/components/providers/SessionProvider";
import { CartProvider } from "@/lib/CartContext";
import { CategoriesProvider } from "@/lib/CategoriesContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { prisma } from "@/lib/prisma";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata() {
  const settings = await prisma.siteSettings.findFirst();

  return {
    title: settings?.siteName || "My Shop",
    description: settings?.tagline || "A modern e-commerce store",
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <AuthProvider>
          <CartProvider>
            <CategoriesProvider>
              <Navbar />
              <main className="pb-20 md:pb-0 min-h-screen">{children}</main>
              <Footer />
              <BottomNav />
            </CategoriesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
