import { Inter } from "next/font/google";
import AuthProvider from "@/components/providers/SessionProvider";
import { CartProvider } from "@/lib/CartContext";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
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
            <Navbar />
            <main>{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
