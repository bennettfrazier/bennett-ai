import type React from "react"
import "./globals.css"
import { Outfit } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeScript } from "@/components/theme-script"

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
        <ThemeScript />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
