import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JOURNEY_STAGES } from "@/lib/constants"
import { CheckCircle2, Circle } from "lucide-react"

export default async function AEBuyerPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const profile = await prisma.buyerProfile.findFirst({
    where: {
      id: params.id,
      OR: [{ assignedAEId: session.user.id }, { assignedAE: null }],
    },
    include: {
      user: { select: { name: true, email: true } },
      checklistItems: { orderBy: [{ sortOrder: "asc" }] },
      introductions: { include: { provider: { select: { name: true, category: true } } }, orderBy: { requestedAt: "desc" } },
    },
  })

  if (!profile) notFound()

  const done = profile.checklistItems.filter((i) => i.status === "completed").length
  const total = profile.checklistItems.length
  const stageLabel = JOURNEY_STAGES.find((s) => s.stage === profile.currentStage)?.label ?? profile.currentStage

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-xl">
          {profile.user.name?.[0] ?? "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{profile.user.name}</h1>
          <p className="text-slate-500 text-sm">{profile.user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Current stage", value: stageLabel },
          { label: "Checklist progress", value: `${done}/${total}` },
          { label: "Introductions", value: String(profile.introductions.length) },
          { label: "FTB", value: profile.isFirstTimeBuyer ? "Yes" : "No" },
        ].map(({ label, value }) => (
          <Card key={label}><CardContent className="p-4 text-center"><p className="text-lg font-bold text-slate-900">{value}</p><p className="text-xs text-slate-400 mt-0.5">{label}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Buyer details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { label: "Budget", value: profile.budgetMin && profile.budgetMax ? `€${profile.budgetMin.toLocaleString()} – €${profile.budgetMax.toLocaleString()}` : "—" },
              { label: "Deposit", value: profile.depositAmount ? `€${profile.depositAmount.toLocaleString()}` : "—" },
              { label: "Has AIP", value: profile.hasAIP ? "Yes" : "No" },
              { label: "Counties", value: profile.preferredCounties.join(", ") || "—" },
              { label: "Timeline", value: profile.timeline ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-slate-900">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Introductions</CardTitle></CardHeader>
          <CardContent>
            {profile.introductions.length === 0 ? (
              <p className="text-sm text-slate-400">None yet.</p>
            ) : (
              <div className="space-y-2">
                {profile.introductions.map((intro) => (
                  <div key={intro.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{intro.provider.name}</span>
                    <Badge variant="secondary">{intro.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Checklist</CardTitle></CardHeader>
        <CardContent className="space-y-1.5">
          {profile.checklistItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-sm py-1">
              {item.status === "completed"
                ? <CheckCircle2 className="h-4 w-4 text-brand-600 flex-shrink-0" />
                : <Circle className="h-4 w-4 text-slate-300 flex-shrink-0" />}
              <span className={item.status === "completed" ? "text-slate-400 line-through" : "text-slate-700"}>{item.title}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
