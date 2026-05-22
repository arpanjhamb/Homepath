import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  requested: { label: "Requested", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  responded: { label: "Responded", variant: "default" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

export default async function IntroductionsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const profile = await prisma.buyerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) redirect("/onboarding")

  const introductions = await prisma.introduction.findMany({
    where: { buyerProfileId: profile.id },
    include: { provider: { select: { id: true, name: true, category: true, shortBio: true } } },
    orderBy: { requestedAt: "desc" },
  })

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Introductions</h1>
        <p className="text-slate-500 text-sm mt-1">Track all the provider introductions you've requested.</p>
      </div>
      {introductions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-slate-500 mb-4">You haven't requested any introductions yet.</p>
            <Link href="/marketplace" className="text-brand-700 font-medium hover:underline">Browse the marketplace</Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {introductions.map((intro) => {
            const status = STATUS_LABELS[intro.status] ?? STATUS_LABELS.requested
            return (
              <Card key={intro.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{intro.provider.name}</h3>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{intro.provider.shortBio}</p>
                      <p className="text-xs text-slate-400">Requested {formatDate(intro.requestedAt)}</p>
                      {intro.buyerNote && <p className="text-sm text-slate-600 italic">"{intro.buyerNote}"</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
