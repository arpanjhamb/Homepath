"use client"
import { useEffect, useState } from "react"
import { ChecklistItemStatus, JourneyStage } from "@prisma/client"
import { JOURNEY_STAGES } from "@/lib/constants"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/useToast"

interface ChecklistItem {
  id: string
  stage: JourneyStage
  section: string
  title: string
  description: string
  status: ChecklistItemStatus
  relatedCategory: string | null
}

export default function ChecklistPage() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/checklist").then((r) => r.json()).then((data) => { setItems(data); setLoading(false) })
  }, [])

  async function toggle(item: ChecklistItem) {
    const newStatus: ChecklistItemStatus = item.status === "completed" ? "pending" : "completed"
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: newStatus } : i))
    const res = await fetch(`/api/checklist/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (!res.ok) {
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: item.status } : i))
      toast({ title: "Failed to update", variant: "destructive" })
    }
  }

  const total = items.length
  const done = items.filter((i) => i.status === "completed").length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <div className="animate-spin h-8 w-8 border-2 border-brand-600 border-t-transparent rounded-full" />
    </div>
  )

  const grouped = JOURNEY_STAGES.map((s) => ({
    ...s,
    items: items.filter((i) => i.stage === s.stage),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your Checklist</h1>
        <p className="text-slate-500 text-sm mt-1">Personalised steps for your home-buying journey.</p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Overall progress</span>
            <span className="text-sm font-bold text-brand-700">{pct}% complete</span>
          </div>
          <Progress value={pct} className="h-3" />
          <p className="text-xs text-slate-400 mt-2">{done} of {total} steps completed</p>
        </CardContent>
      </Card>

      {grouped.map((group) => {
        const groupDone = group.items.filter((i) => i.status === "completed").length
        return (
          <Card key={group.stage}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{group.label}</CardTitle>
                <Badge variant={groupDone === group.items.length ? "default" : "secondary"}>
                  {groupDone}/{group.items.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 p-3 rounded-xl border transition-colors ${
                    item.status === "completed" ? "bg-brand-50 border-brand-200" : "bg-white border-slate-200"
                  }`}
                >
                  <button onClick={() => toggle(item)} className="mt-0.5 flex-shrink-0">
                    {item.status === "completed"
                      ? <CheckCircle2 className="h-5 w-5 text-brand-600" />
                      : <Circle className="h-5 w-5 text-slate-300 hover:text-brand-400" />
                    }
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${item.status === "completed" ? "line-through text-slate-400" : "text-slate-900"}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                    {item.relatedCategory && item.status !== "completed" && (
                      <Link href={`/marketplace/${item.relatedCategory}`} className="inline-flex items-center gap-1 text-xs text-brand-700 mt-1.5 hover:underline">
                        <ShoppingBag className="h-3 w-3" /> Find a provider
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      <p className="text-xs text-slate-400 text-center pb-4">
        HomePath IE provides guidance only — not financial, legal, or insurance advice.
      </p>
    </div>
  )
}
