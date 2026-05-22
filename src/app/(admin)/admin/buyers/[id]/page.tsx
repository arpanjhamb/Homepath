import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AssignAEButton } from "@/components/admin/AssignAEButton"
import { CheckCircle2, Circle } from "lucide-react"

export default async function AdminBuyerDetailPage({ params }: { params: { id: string } }) {
  const profile = await prisma.buyerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      assignedAE: { select: { id: true, name: true } },
      checklistItems: { orderBy: { sortOrder: "asc" } },
      introductions: { include: { provider: { select: { name: true } } } },
      payments: true,
    },
  })
  if (!profile) notFound()

  const aes = await prisma.user.findMany({ where: { role: "account_executive" }, select: { id: true, name: true } })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{profile.user.name}</h1>
          <p className="text-slate-500 text-sm">{profile.user.email}</p>
        </div>
        <AssignAEButton buyerId={profile.id} currentAEId={profile.assignedAE?.id} aes={aes} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Onboarding", value: profile.onboardingStatus },
          { label: "Stage", value: profile.currentStage.replace(/_/g, " ") },
          { label: "FTB", value: profile.isFirstTimeBuyer ? "Yes" : "No" },
          { label: "AIP", value: profile.hasAIP ? "Yes" : "No" },
          { label: "Assigned AE", value: profile.assignedAE?.name ?? "Unassigned" },
          { label: "Fee paid", value: profile.completionFeePaid ? "Yes ✓" : "No" },
        ].map(({ label, value }) => (
          <Card key={label}><CardContent className="p-4"><p className="text-xs text-slate-400">{label}</p><p className="font-semibold text-slate-900 mt-0.5">{value}</p></CardContent></Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Introductions</CardTitle></CardHeader>
          <CardContent>
            {profile.introductions.length === 0 ? <p className="text-sm text-slate-400">None.</p> : profile.introductions.map((i) => (
              <div key={i.id} className="flex justify-between py-1.5 text-sm border-b border-slate-50">
                <span className="text-slate-700">{i.provider.name}</span>
                <Badge variant="secondary">{i.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-1 max-h-64 overflow-y-auto">
            {profile.checklistItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-xs py-0.5">
                {item.status === "completed" ? <CheckCircle2 className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" /> : <Circle className="h-3.5 w-3.5 text-slate-200 flex-shrink-0" />}
                <span className={item.status === "completed" ? "line-through text-slate-400" : "text-slate-600"}>{item.title}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
