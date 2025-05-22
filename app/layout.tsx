// app/layout.tsx

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Congress Donor Tracker",
  description: "Track donations to U.S. Congress members",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen bg-background">
            <header className="border-b">
              <div className="w-full flex h-16 items-center px-4">
                <h1 className="text-xl font-bold">Congress Donor Tracker</h1>
              </div>
            </header>

            <main className="flex-1 w-full">{children}</main>

            {/* Expanded footer with credits & links */}
            <footer className="border-t bg-gray-50 dark:bg-gray-900 py-4">
              <div className="w-full px-4 text-center text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  Data powered by{" "}
                  <a
                    href="https://unitedstates.github.io/congress-legislators/legislators-current.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Congress Legislators JSON
                  </a>
                  {" & "}
                  <a
                    href="https://api.open.fec.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    OpenFEC API
                  </a>
                  .
                </p>
                <p>
                  Free forever. Built and maintained by{" "}
                  <a
                    href="https://github.com/ulamatta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Umberto La Matta
                  </a>{" "}
                  (HTX).
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
