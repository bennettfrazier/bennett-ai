import type React from "react"
import "./globals.css"
import { Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "600"],
})

export const metadata = {
  title: "Bennett AI Chat",
  description: "Chat with Bennett AI assistant",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      (function() {
        try {
          const storageKey = 'claude-theme';
          const savedTheme = localStorage.getItem(storageKey);
          
          // Remove any existing theme classes
          document.documentElement.classList.remove('light', 'dark');
          
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else if (savedTheme === 'light') {
            document.documentElement.classList.add('light');
          } else {
            // If theme is 'system' or not set, check system preference
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.add(systemPrefersDark ? 'dark' : 'light');
          }
        } catch (e) {
          // Fallback to light theme if there's an error
          document.documentElement.classList.add('light');
        }
      })();
    `,
          }}
        />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="claude-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'