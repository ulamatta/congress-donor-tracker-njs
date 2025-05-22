"use client"

import type React from "react"
import { SWRConfig } from "swr"

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string) => {
          try {
            const res = await fetch(url)
            if (!res.ok) {
              const errorText = await res.text()
              throw new Error(`API error: ${res.status} - ${errorText}`)
            }
            return res.json()
          } catch (error) {
            console.error("SWR fetcher error:", error)
            throw error
          }
        },
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 2,
        errorRetryInterval: 3000,
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          // Never retry on 404
          if (error.message.includes("404")) return

          // Only retry up to 3 times
          if (retryCount >= 3) return

          // Retry after 3 seconds
          setTimeout(() => revalidate({ retryCount }), 3000)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
