"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/useToast"
import { useRouter } from "next/navigation"

export function MarkSentButton({ introId }: { introId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function mark() {
    setLoading(true)
    const res = await fetch(`/api/introductions/${introId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sent" }),
    })
    if (res.ok) {
      toast({ title: "Marked as sent" })
      router.refresh()
    } else {
      toast({ title: "Failed", variant: "destructive" })
    }
    setLoading(false)
  }

  return (
    <Button size="sm" variant="outline" onClick={mark} disabled={loading}>
      {loading ? "…" : "Mark as sent"}
    </Button>
  )
}
