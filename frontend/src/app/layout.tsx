import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

/**
 * src/app/layout.tsx
 * ───────────────────
 * Root layout — wraps every page in the app.
 * This is where we:
 *   • Load Google Fonts (Inter)
 *   • Set HTML metadata (title, description for SEO)
 *   • Wrap the app with AuthProvider (global auth state)
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ShikshaAI — AI for Equitable Education",
    template: "%s | ShikshaAI",
  },
  description:
    "ShikshaAI provides personalized AI-powered tutoring, adaptive practice, and multi-lingual learning support to bridge the education gap in India.",
  keywords: ["AI education", "adaptive learning", "NCERT", "India education", "AI tutor"],
  authors: [{ name: "ShikshaAI Team" }],
  openGraph: {
    title: "ShikshaAI — AI for Equitable Education",
    description: "Personalized AI tutoring for every Indian student",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-950 font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
