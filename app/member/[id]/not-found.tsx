import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MemberNotFound() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <h2 className="text-3xl font-bold">Member Not Found</h2>
      <p className="text-muted-foreground">The member you're looking for doesn't exist or couldn't be found.</p>
      <Link href="/">
        <Button className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Roster
        </Button>
      </Link>
    </div>
  )
}
