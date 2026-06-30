import AuthProvider from "@/components/providers/SessionProvider";
import { CartProvider } from "@/lib/CartContext";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "My Shop",
  description: "A modern e-commerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
