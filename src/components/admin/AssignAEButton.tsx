"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"

interface Props {
  buyerId: string
  currentAEId?: string
  aes: { id: string; name: string | null }[]
}

export function AssignAEButton({ buyerId, currentAEId, aes }: Props) {
  const [selected, setSelected] = useState(currentAEId ?? "")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function save() {
    setLoading(true)
    const res = await fetch(`/api/admin/buyers/${buyerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedAEId: selected }),
    })
    if (res.ok) {
      toast({ title: "AE assigned" })
      router.refresh()
    } else {
      toast({ title: "Failed", variant: "destructive" })
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-300 text-sm">
        <option value="">Unassigned</option>
        {aes.map((ae) => <option key={ae.id} value={ae.id}>{ae.name}</option>)}
      </select>
      <Button size="sm" onClick={save} disabled={loading}>{loading ? "…" : "Assign"}</Button>
    </div>
  )
}
