"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/useToast"
import { PROVIDER_CATEGORIES, IRISH_COUNTIES } from "@/lib/constants"

interface Provider {
  id: string
  name: string
  category: string
  shortBio: string
  description: string
  website?: string | null
  email?: string | null
  phone?: string | null
  counties: string[]
  nationalCoverage: boolean
  featured: boolean
  isActive: boolean
  commissionRate?: number | null
}

export function ProviderForm({ provider }: { provider?: Provider }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: provider?.name ?? "",
    category: provider?.category ?? PROVIDER_CATEGORIES[0].key,
    shortBio: provider?.shortBio ?? "",
    description: provider?.description ?? "",
    website: provider?.website ?? "",
    email: provider?.email ?? "",
    phone: provider?.phone ?? "",
    counties: provider?.counties ?? [],
    nationalCoverage: provider?.nationalCoverage ?? false,
    featured: provider?.featured ?? false,
    isActive: provider?.isActive ?? true,
    commissionRate: provider?.commissionRate ?? "",
  })

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }))

  const toggleCounty = (c: string) =>
    set("counties", form.counties.includes(c) ? form.counties.filter((x) => x !== c) : [...form.counties, c])

  async function save() {
    setLoading(true)
    const url = provider ? `/api/admin/providers/${provider.id}` : "/api/admin/providers"
    const method = provider ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, commissionRate: form.commissionRate ? Number(form.commissionRate) : null }),
    })
    if (res.ok) {
      toast({ title: provider ? "Provider updated" : "Provider created" })
      router.push("/admin/providers")
      router.refresh()
    } else {
      toast({ title: "Failed to save", variant: "destructive" })
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Provider name" />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600">
              {PROVIDER_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Short bio (1–2 sentences)</Label>
          <Input value={form.shortBio} onChange={(e) => set("shortBio", e.target.value)} placeholder="Shown on marketplace cards" />
        </div>
        <div className="space-y-1.5">
          <Label>Full description</Label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 resize-none" placeholder="Detailed description shown on provider page" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Website</Label>
            <Input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Commission rate (%)</Label>
          <Input type="number" value={form.commissionRate} onChange={(e) => set("commissionRate", e.target.value)} placeholder="e.g. 0.5" />
        </div>
        <div>
          <Label className="mb-2 block">Counties covered</Label>
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.nationalCoverage} onChange={(e) => set("nationalCoverage", e.target.checked)} className="rounded" />
              National coverage (all counties)
            </label>
          </div>
          {!form.nationalCoverage && (
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {IRISH_COUNTIES.map((c) => (
                <button key={c} type="button" onClick={() => toggleCounty(c)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.counties.includes(c) ? "bg-brand-700 text-white border-brand-700" : "bg-white text-slate-600 border-slate-300 hover:border-brand-400"}`}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded" />
            Featured provider
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="rounded" />
            Active (visible to buyers)
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => router.push("/admin/providers")}>Cancel</Button>
          <Button onClick={save} disabled={loading}>{loading ? "Saving…" : provider ? "Update provider" : "Create provider"}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
