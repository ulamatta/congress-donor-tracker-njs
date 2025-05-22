import { NextResponse } from "next/server";

interface Donor {
  employer: string;
  total_amt: number;
}

interface MemberDetail {
  bioguide: string;
  name: string;
  party: string;
  state: string;
  chamber: string;
  photo: string;
  donors: Donor[];
}

// Simple fetch with retry for 429s
async function safeFetch(url: string, opts?: RequestInit) {
  let attempts = 0;
  while (attempts < 3) {
    const res = await fetch(url, { ...opts, cache: "no-store" });
    if (res.status === 429) {
      const wait = (Number(res.headers.get("Retry-After")) || 1) * 1000;
      await new Promise((r) => setTimeout(r, wait));
      attempts++;
      continue;
    }
    if (!res.ok) break;
    return res.json();
  }
  return { results: [], pagination: { pages: 0 } };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // 1) Load roster, find member
  const roster = await fetch(
    `${process.env.ROSTER_URL!}`
  ).then((r) => r.json());
  const memberInfo = roster.find((m: any) => m.id?.bioguide === id);
  if (!memberInfo)
    return NextResponse.json({ error: "Member not found" }, { status: 404 });

  const fecId = memberInfo.id.fec?.[0] || "";
  const lastTerm = memberInfo.terms.slice(-1)[0];
  const detail: MemberDetail = {
    bioguide: id,
    name: `${memberInfo.name.first} ${memberInfo.name.last}`,
    party: lastTerm.party,
    state: lastTerm.state,
    chamber: lastTerm.type === "sen" ? "Senate" : "House",
    photo: `https://unitedstates.github.io/images/congress/450x550/${id}.jpg`,
    donors: [],
  };

  if (fecId) {
    // 2) Fetch committees
    const commList: any = await safeFetch(
      `https://api.open.fec.gov/v1/candidate/${fecId}/committees?api_key=${process.env.API_KEY!}`
    );
    const committees = commList.results || [];

    // 3) Aggregate employers
    const totals = new Map<string, number>();
    for (const cm of committees) {
      let page = 1,
        hasMore = true;
      while (hasMore) {
        const url = new URL(process.env.FEC_EMPLOYER!);
        url.searchParams.set("committee_id", cm.committee_id);
        url.searchParams.set("api_key", process.env.API_KEY!);
        url.searchParams.set("per_page", "100");
        url.searchParams.set("page", String(page));

        const data: any = await safeFetch(url.toString());
        const results = data.results || [];
        if (!results.length) break;

        for (const d of results) {
          const emp = d.employer || "Unknown";
          totals.set(emp, (totals.get(emp) || 0) + (d.total || 0));
        }
        page++;
        hasMore = page <= (data.pagination?.pages || 0) && page <= 5;
      }
    }

    // 4) Sort & slice top 3 (or ?count= in querystring)
    const count = Number(new URL(request.url).searchParams.get("count")) || 3;
    detail.donors = Array.from(totals.entries())
      .map(([employer, total_amt]) => ({ employer, total_amt }))
      .sort((a, b) => b.total_amt - a.total_amt)
      .slice(0, count);
  }

  return NextResponse.json(detail);
}
