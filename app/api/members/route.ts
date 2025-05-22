import { NextResponse } from "next/server"
import type { Member } from "@/types"

export async function GET() {
  try {
    console.log(`Fetching roster from: ${process.env.ROSTER_URL}`)
    const res = await fetch(process.env.ROSTER_URL!, { cache: "no-store" })

    if (!res.ok) {
      console.error(`Roster API error: ${res.status}`)
      return NextResponse.json({ error: `Failed to fetch roster: ${res.status}` }, { status: res.status })
    }

    const raws = await res.json()

    const members: Member[] = raws.map((m: any) => {
      const currentTerm = m.terms[m.terms.length - 1]
      return {
        bioguide: m.id?.bioguide || "unknown",
        fec_id: m.id?.fec?.length > 0 ? m.id.fec[0] : "",
        first: m.name?.first || "",
        last: m.name?.last || "",
        party: currentTerm?.party || "Unknown",
        state: currentTerm?.state || "Unknown",
        chamber: currentTerm?.type === "sen" ? "Senate" : "House",
      }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error in members API:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
