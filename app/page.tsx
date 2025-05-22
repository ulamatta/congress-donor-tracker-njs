import { SWRProvider } from "@/components/swr-provider"
import { MembersGrid } from "@/components/members-grid"

export default function RosterPage() {
  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Congress Members</h2>
          <p className="text-muted-foreground">Browse and filter U.S. House and Senate members.</p>
        </div>

        <SWRProvider>
          <MembersGrid />
        </SWRProvider>
      </div>
    </div>
  )
}