import { Inter } from "next/font/google";
import AuthProvider from "@/components/providers/SessionProvider";
import { CartProvider } from "@/lib/CartContext";
import { CategoriesProvider } from "@/lib/CategoriesContext";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "My Shop",
  description: "A modern e-commerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
        <AuthProvider>
          <CartProvider>
            <CategoriesProvider>
              <Navbar />
              <main className="pb-20 md:pb-0">{children}</main>
              <BottomNav />
            </CategoriesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
