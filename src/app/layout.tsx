import type { Metadata } from "next";
import { Poppins, Lora, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandBarProvider } from "@/context/command-bar-context";

// Import storage debug utility for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  import("@/lib/storage-debug");
}

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Task Flow",
  description: "A modern task management application built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${poppins.variable} ${lora.variable} ${firaCode.variable} antialiased`}
          >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandBarProvider>
            {children}
          </CommandBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
