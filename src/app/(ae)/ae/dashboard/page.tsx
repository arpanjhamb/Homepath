import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { MarkSentButton } from "@/components/ae/MarkSentButton"

export default async function AEDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const buyers = await prisma.buyerProfile.findMany({
    where: { assignedAEId: session.user.id },
    include: {
      user: { select: { name: true, email: true } },
      checklistItems: true,
      introductions: { where: { status: "requested" } },
    },
    orderBy: { updatedAt: "desc" },
  })

  const pendingIntros = await prisma.introduction.findMany({
    where: { buyerProfile: { assignedAEId: session.user.id }, status: "requested" },
    include: {
      buyerProfile: { include: { user: { select: { name: true } } } },
      provider: { select: { name: true, category: true } },
    },
    orderBy: { requestedAt: "desc" },
  })

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AE Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, {session.user.name?.split(" ")[0]}.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-brand-700">{buyers.length}</p><p className="text-sm text-slate-500 mt-1">Assigned buyers</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-amber-600">{pendingIntros.length}</p><p className="text-sm text-slate-500 mt-1">Pending introductions</p></CardContent></Card>
        <Card><CardContent className="p-5 text-center"><p className="text-3xl font-bold text-brand-700">{buyers.filter((b) => b.completionFeePaid).length}</p><p className="text-sm text-slate-500 mt-1">Completions</p></CardContent></Card>
      </div>

      {pendingIntros.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base text-amber-700">Pending introductions to action</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {pendingIntros.map((intro) => (
              <AEIntroRow key={intro.id} intro={intro} />
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Your buyers</CardTitle></CardHeader>
        <CardContent>
          {buyers.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">No buyers assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {buyers.map((b) => {
                const done = b.checklistItems.filter((i) => i.status === "completed").length
                const total = b.checklistItems.length
                const pct = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <Link key={b.id} href={`/ae/buyers/${b.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm">
                          {b.user.name?.[0] ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{b.user.name}</p>
                          <p className="text-xs text-slate-400">{b.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-500">{pct}% complete</span>
                        {b.introductions.length > 0 && (
                          <Badge variant="secondary">{b.introductions.length} pending intro{b.introductions.length > 1 ? "s" : ""}</Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AEIntroRow({ intro }: { intro: any }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50">
      <div>
        <p className="text-sm font-medium text-slate-900">{intro.buyerProfile.user.name} → {intro.provider.name}</p>
        <p className="text-xs text-slate-500">{formatDate(intro.requestedAt)}</p>
      </div>
      <MarkSentButton introId={intro.id} />
    </div>
  )
}
