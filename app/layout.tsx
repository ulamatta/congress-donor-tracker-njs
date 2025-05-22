import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Congress Donor Tracker",
  description: "Track donations to U.S. Congress members",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="w-full flex h-16 items-center px-4">
                <h1 className="text-xl font-bold">Congress Donor Tracker</h1>
              </div>
            </header>
            <main className="w-full">{children}</main>
            <footer className="border-t py-4">
              <div className="w-full px-4 text-center text-sm text-muted-foreground">
                Data provided by the Federal Election Commission and United States Congress
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}