"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import type { Member } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function MembersGrid() {
  const {
    data: members,
    error,
    isLoading,
  } = useSWR<Member[]>("/api/members", async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`API error: ${res.status} - ${errorText}`)
    }
    return res.json()
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [partyFilter, setPartyFilter] = useState<string | null>(null)
  const [chamberFilter, setChamberFilter] = useState<string | null>(null)

  // Filter members
  const filteredMembers = members?.filter((member) => {
    const fullName = `${member.first || ""} ${member.last || ""}`.toLowerCase()
    const matchesSearch = searchTerm === "" || fullName.includes(searchTerm.toLowerCase())
    const matchesParty = partyFilter === null || member.party === partyFilter
    const matchesChamber = chamberFilter === null || member.chamber === chamberFilter

    return matchesSearch && matchesParty && matchesChamber
  })

  if (error) {
    console.error("SWR error:", error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error loading members. Please try again later.
          <br />
          Error: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex flex-wrap gap-2">
          <Button variant={partyFilter === null ? "default" : "outline"} onClick={() => setPartyFilter(null)} size="sm">
            All Parties
          </Button>
          <Button
            variant={partyFilter === "Democrat" ? "default" : "outline"}
            onClick={() => setPartyFilter("Democrat")}
            size="sm"
          >
            Democrats
          </Button>
          <Button
            variant={partyFilter === "Republican" ? "default" : "outline"}
            onClick={() => setPartyFilter("Republican")}
            size="sm"
          >
            Republicans
          </Button>
          <Button
            variant={partyFilter === "Independent" ? "default" : "outline"}
            onClick={() => setPartyFilter("Independent")}
            size="sm"
          >
            Independents
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={chamberFilter === null ? "default" : "outline"}
            onClick={() => setChamberFilter(null)}
            size="sm"
          >
            All Chambers
          </Button>
          <Button
            variant={chamberFilter === "House" ? "default" : "outline"}
            onClick={() => setChamberFilter("House")}
            size="sm"
          >
            House
          </Button>
          <Button
            variant={chamberFilter === "Senate" ? "default" : "outline"}
            onClick={() => setChamberFilter("Senate")}
            size="sm"
          >
            Senate
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-md" />
          ))}
        </div>
      ) : (
        <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {!filteredMembers || filteredMembers.length === 0 ? (
            <div className="col-span-full rounded-md border p-4 text-center">
              No members found matching your filters.
            </div>
          ) : (
            filteredMembers.map((member) => (
              <Link key={member.bioguide} href={`/member/${member.bioguide}`}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                  <div className="relative h-[200px] w-full">
                    <Image
                      src={`https://unitedstates.github.io/images/congress/450x550/${member.bioguide}.jpg`}
                      alt={`${member.first || ""} ${member.last || ""}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "/assets/placeholder.png"
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">
                      {member.first || ""} {member.last || ""}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {member.party || "Unknown"} • {member.state || "Unknown"} • {member.chamber || "Unknown"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}