import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CommandMenu from "@/components/CommandMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Corporate Ecosystem Explorer",
  description: "AI-powered Corporate Ecosystem Research Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen`}>
        {children}
        <CommandMenu />
      </body>
    </html>
  );
}
