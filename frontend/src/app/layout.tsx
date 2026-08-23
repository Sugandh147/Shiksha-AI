import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

/**
 * src/app/layout.tsx
 * ───────────────────
 * Root layout — wraps every page in the app with Auth & Toast providers.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ShikshaAI — Intelligent Multilingual AI Learning Ecosystem",
    template: "%s | ShikshaAI",
  },
  description:
    "ShikshaAI empowers Indian K-12 students with grounded RAG AI tutoring, vision question solving, adaptive practice engines, and teacher intelligence.",
  keywords: ["AI education", "adaptive learning", "NCERT", "India education", "AI tutor", "ClassPulse"],
  authors: [{ name: "ShikshaAI Team" }],
  openGraph: {
    title: "ShikshaAI — Intelligent Multilingual AI Learning Ecosystem",
    description: "Personalized AI tutoring and teacher intelligence for India",
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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
