import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MemberLoading() {
  return (
    <div className="space-y-8">
      <Button variant="ghost" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Roster
      </Button>

      <div className="grid gap-6 md:grid-cols-[250px_1fr]">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-[275px] w-[225px] rounded-lg" />
        </div>

        <div className="space-y-4">
          <div>
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="mt-2 h-6 w-[200px]" />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-[200px]" />
              <Skeleton className="h-[300px] w-full" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-[200px]" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
