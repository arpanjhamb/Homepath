import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { JOURNEY_STAGES } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, ShoppingBag, Send, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const profile = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      assignedAE: true,
      checklistItems: { orderBy: [{ stage: "asc" }, { sortOrder: "asc" }] },
      introductions: true,
    },
  })

  if (!profile || profile.onboardingStatus !== "completed") redirect("/onboarding")

  const total = profile.checklistItems.length
  const done = profile.checklistItems.filter((i) => i.status === "completed").length
  const nextItems = profile.checklistItems.filter((i) => i.status !== "completed").slice(0, 3)
  const currentStageIndex = JOURNEY_STAGES.findIndex((s) => s.stage === profile.currentStage)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Good morning, {session.user.name?.split(" ")[0]} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">{new Date().toLocaleDateString("en-IE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-brand-800 to-brand-700 rounded-2xl p-6 text-white">
        <p className="font-semibold text-lg mb-1">Your journey is underway</p>
        <p className="text-brand-100 text-sm">You've completed {done} of {total} checklist items. Keep going!</p>
        <div className="mt-3 bg-white/20 rounded-full h-2">
          <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
        </div>
        <Link href="/checklist" className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-white hover:underline">
          View full checklist <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-brand-700">{total - done}</p>
            <p className="text-sm text-slate-500 mt-1">Tasks remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-brand-700">{profile.introductions.length}</p>
            <p className="text-sm text-slate-500 mt-1">Introductions sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-brand-700">{done}</p>
            <p className="text-sm text-slate-500 mt-1">Steps completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Journey stage tracker */}
      <Card>
        <CardHeader><CardTitle>Your journey</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {JOURNEY_STAGES.map((s, i) => {
              const isActive = i === currentStageIndex
              const isDone = i < currentStageIndex
              return (
                <div key={s.stage} className="flex items-center gap-1 flex-shrink-0">
                  <div className={`flex flex-col items-center gap-1`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? "bg-brand-600 text-white" : isActive ? "bg-brand-700 text-white ring-4 ring-brand-100" : "bg-slate-100 text-slate-400"
                    }`}>
                      {isDone ? "✓" : s.order}
                    </div>
                    <span className={`text-xs text-center max-w-[72px] leading-tight ${isActive ? "text-brand-700 font-medium" : isDone ? "text-brand-500" : "text-slate-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < JOURNEY_STAGES.length - 1 && (
                    <div className={`h-0.5 w-8 flex-shrink-0 mb-5 ${isDone ? "bg-brand-500" : "bg-slate-200"}`} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Next actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Next actions
              <Link href="/checklist" className="text-sm font-normal text-brand-700 hover:underline">View all</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextItems.length === 0 ? (
              <p className="text-sm text-slate-500">All tasks complete! 🎉</p>
            ) : (
              nextItems.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg bg-slate-50">
                  <Circle className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                    {item.relatedCategory && (
                      <Link href={`/marketplace/${item.relatedCategory}`} className="inline-flex items-center gap-1 text-xs text-brand-700 mt-1 hover:underline">
                        <ShoppingBag className="h-3 w-3" /> View providers
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* AE Card */}
        <Card>
          <CardHeader><CardTitle>Your Account Executive</CardTitle></CardHeader>
          <CardContent>
            {profile.assignedAE ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-lg">
                    {profile.assignedAE.name?.[0] ?? "A"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{profile.assignedAE.name}</p>
                    <p className="text-sm text-slate-500">Account Executive</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">{profile.assignedAE.email}</p>
                <p className="text-sm text-slate-600">Your dedicated guide through the entire home-buying process.</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">Being assigned</p>
                <p className="text-xs text-slate-400 mt-1">An Account Executive will be assigned to you shortly.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Marketplace shortcut */}
      <Card className="border-brand-200 bg-brand-50">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-brand-700" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Browse the provider marketplace</p>
              <p className="text-sm text-slate-500">Compare mortgage brokers, solicitors, surveyors and more.</p>
            </div>
          </div>
          <Link href="/marketplace">
            <button className="flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline">
              Explore <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
