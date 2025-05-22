"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { DonorChart } from "@/components/donor-chart"
import type { MemberDetail as MemberDetailType } from "@/types"

interface MemberDetailProps {
  id: string
}

export function MemberDetail({ id }: MemberDetailProps) {
  const [donorCount, setDonorCount] = useState(5)

  const { data, error, isLoading, mutate } = useSWR<MemberDetailType>(`/api/member/${id}?count=${donorCount}`, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 2,
  })

  const handleRetry = () => {
    mutate()
  }

  const handleDonorCountChange = (count: number) => {
    setDonorCount(count)
  }

  if (error) {
    console.error("SWR error:", error)
    return (
      <div className="space-y-8">
        <Link href="/" className="inline-block">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Roster
          </Button>
        </Link>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Unable to load member details. Please try again later or select a different member.
            <div className="mt-2">
              <Button onClick={handleRetry} size="sm" variant="outline">
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/" className="inline-block">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Roster
        </Button>
      </Link>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-[275px] w-[225px] overflow-hidden rounded-lg">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <Image
                src={data?.photo || "/assets/placeholder.png"}
                alt={data?.name || "Congress Member"}
                fill
                className="object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = "/assets/placeholder.png"
                }}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-10 w-[300px]" /> : data?.name || "Unknown Member"}
            </h2>
            {/* Fix: Don't put Skeleton inside p tag */}
            {isLoading ? (
              <Skeleton className="mt-2 h-6 w-[200px]" />
            ) : (
              <div className="text-xl text-muted-foreground">
                {data?.party || "Unknown"} • {data?.state || "Unknown"} • {data?.chamber || "Unknown"}
              </div>
            )}
          </div>

          <div className="space-y-8">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-[400px] w-full" />
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Top Donors by Employer</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Show:</span>
                      {[3, 5, 10].map((count) => (
                        <Button
                          key={count}
                          size="sm"
                          variant={donorCount === count ? "default" : "outline"}
                          onClick={() => handleDonorCountChange(count)}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {data?.donors && data.donors.length > 0 ? (
                    <div className="h-[400px]">
                      <DonorChart donors={data.donors} />
                    </div>
                  ) : (
                    <div className="rounded-md border p-4 text-center">
                      <p>No donor information available for this member.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
