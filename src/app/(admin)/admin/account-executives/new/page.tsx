"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/useToast"

export default function NewAEPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)

  async function save() {
    setLoading(true)
    const res = await fetch("/api/admin/account-executives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast({ title: "Account Executive created" })
      router.push("/admin/account-executives")
    } else {
      const { error } = await res.json()
      toast({ title: error ?? "Failed", variant: "destructive" })
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Add Account Executive</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Sarah Murphy" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="sarah@homepath.ie" />
          </div>
          <div className="space-y-1.5">
            <Label>Temporary password</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Min 8 characters" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => router.push("/admin/account-executives")}>Cancel</Button>
            <Button onClick={save} disabled={loading || !form.name || !form.email || form.password.length < 8}>
              {loading ? "Creating…" : "Create AE"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
