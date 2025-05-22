"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Member } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface MembersTableProps {
  members: Member[]
}

export function MembersTable({ members }: MembersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [partyFilter, setPartyFilter] = useState("all")
  const [chamberFilter, setChamberFilter] = useState("all")
  const [stateFilter, setStateFilter] = useState("all")
  const [sortField, setSortField] = useState<keyof Member>("last")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Get unique states for filter
  const states = Array.from(new Set(members.map((member) => member.state))).sort()

  // Filter members
  const filteredMembers = members.filter((member) => {
    const fullName = `${member.first} ${member.last}`.toLowerCase()
    const matchesSearch = searchTerm === "" || fullName.includes(searchTerm.toLowerCase())
    const matchesParty = partyFilter === "all" || member.party.includes(partyFilter)
    const matchesChamber = chamberFilter === "all" || member.chamber === chamberFilter
    const matchesState = stateFilter === "all" || member.state === stateFilter

    return matchesSearch && matchesParty && matchesChamber && matchesState
  })

  // Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  // Handle sort
  const handleSort = (field: keyof Member) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Party <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={partyFilter} onValueChange={setPartyFilter}>
                <DropdownMenuRadioItem value="all">All Parties</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Democratic">Democratic</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Republican">Republican</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Independent">Independent</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Chamber <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={chamberFilter} onValueChange={setChamberFilter}>
                <DropdownMenuRadioItem value="all">All Chambers</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="House">House</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Senate">Senate</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                State <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-[300px] overflow-y-auto">
              <DropdownMenuRadioGroup value={stateFilter} onValueChange={setStateFilter}>
                <DropdownMenuRadioItem value="all">All States</DropdownMenuRadioItem>
                {states.map((state) => (
                  <DropdownMenuRadioItem key={state} value={state}>
                    {state}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead onClick={() => handleSort("last")} className="cursor-pointer">
                Name {sortField === "last" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("party")} className="cursor-pointer">
                Party {sortField === "party" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("state")} className="cursor-pointer">
                State {sortField === "state" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead onClick={() => handleSort("chamber")} className="cursor-pointer">
                Chamber {sortField === "chamber" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              sortedMembers.map((member) => (
                <TableRow key={member.bioguide}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={member.photo || "/placeholder.svg"}
                        alt={`${member.first} ${member.last}`}
                        width={48}
                        height={48}
                        className="object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/member/${member.bioguide}`} className="font-medium hover:underline">
                      {member.first} {member.last}
                    </Link>
                  </TableCell>
                  <TableCell>{member.party}</TableCell>
                  <TableCell>{member.state}</TableCell>
                  <TableCell>{member.chamber}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
