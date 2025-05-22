import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 text-center">
      <h2 className="text-3xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/">
        <Button className="gap-2">
          <Home className="h-4 w-4" />
          Go Home
        </Button>
      </Link>
    </div>
  )
}
