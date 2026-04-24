import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "BFHL | Advanced Hierarchy Visualizer",
  description: "A premium full-stack solution for building, validating, and visualizing complex node hierarchies with real-time cycle detection.",
  keywords: ["BFHL", "Hierarchy", "Graph", "Tree", "Visualizer", "React", "Next.js", "Node.js"],
  authors: [{ name: "Sameer_26082004" }],
  openGraph: {
    title: "BFHL Hierarchy Visualizer",
    description: "Premium node relationship analysis and visualization tool.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 font-sans selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
