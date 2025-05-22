import { NextResponse } from "next/server";

interface Donor { employer: string; total_amt: number; }
interface MemberDetail {
  bioguide: string;
  name: string;
  party: string;
  state: string;
  chamber: string;
  photo: string;
  donors: Donor[];
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // 1) fetch roster
  const rosterRes = await fetch(process.env.ROSTER_URL!, { cache: "no-store" });
  const roster = await rosterRes.json();
  const member = roster.find((m: any) => m.id?.bioguide === id);
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // 2) assemble base detail
  const term = member.terms.slice(-1)[0];
  const detail: MemberDetail = {
    bioguide: id,
    name: `${member.name.first} ${member.name.last}`,
    party: term.party,
    state: term.state,
    chamber: term.type === "sen" ? "Senate" : "House",
    photo: `https://unitedstates.github.io/images/congress/450x550/${id}.jpg`,
    donors: [],
  };

  // 3) fetch FEC committees
  const commUrl = new URL(
    `https://api.open.fec.gov/v1/candidate/${member.id.fec[0]}/committees/`
  );
  commUrl.searchParams.set("api_key", process.env.API_KEY!);
  commUrl.searchParams.set("cycle", "2024");
  console.log("⟳ fetching committees:", commUrl.toString());

  const commRes = await fetch(commUrl.toString(), { cache: "no-store" });
  const commData = await commRes.json();
  console.log("  → got", commData.results.length, "committees");
  const committees = commData.results || [];

  // 4) aggregate by-employer totals
  const totals = new Map<string, number>();
  for (const c of committees) {
    const cmteId = c.committee_id;
    console.log("  ◾ processing committee:", cmteId);

    for (let page = 1; page <= 5; page++) {
      const url = new URL(process.env.FEC_EMPLOYER!);
      url.searchParams.set("api_key", process.env.API_KEY!);
      url.searchParams.set("cycle", "2024");
      url.searchParams.set("committee_id", cmteId);
      url.searchParams.set("per_page", "100");
      url.searchParams.set("page", String(page));
      url.searchParams.set("sort", "-total");           // ← same as your Python

      console.log(`    ⟳ page ${page}:`, url.toString());
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) {
        console.warn("    ⚠ schedule_a error:", res.status);
        break;
      }
      const js = await res.json();
      console.log("      → results count:", js.results.length);

      if (!js.results.length) break;
      for (const d of js.results) {
        const emp = (d.employer || "Unknown").trim();
        const amt = d.total || 0;
        totals.set(emp, (totals.get(emp) || 0) + amt);
      }
    }
  }

  // 5) pick top N
  const count = Number(new URL(request.url).searchParams.get("count")) || 3;
  const sorted = Array.from(totals.entries())
    .map(([employer, total_amt]) => ({ employer, total_amt }))
    .sort((a, b) => b.total_amt - a.total_amt)
    .slice(0, count);

  console.log("✅ returning top", sorted.length, "donors:", sorted);
  detail.donors = sorted;
  return NextResponse.json(detail);
}
