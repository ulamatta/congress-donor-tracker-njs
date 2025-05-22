import { SWRProvider } from "@/components/swr-provider"
import { MemberDetail } from "@/components/member-detail"

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <SWRProvider>
      <MemberDetail id={id} />
    </SWRProvider>
  )
}
