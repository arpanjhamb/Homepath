import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PROVIDER_CATEGORIES } from "@/lib/constants"
import Link from "next/link"

export default async function AdminProvidersPage() {
  const providers = await prisma.provider.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Providers ({providers.length})</h1>
        <Link href="/admin/providers/new"><Button>Add provider</Button></Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Name", "Category", "Coverage", "Status", "Commission", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => {
                const catLabel = PROVIDER_CATEGORIES.find((c) => c.key === p.category)?.label ?? p.category
                return (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}{p.featured && <span className="ml-2 text-xs text-amber-600">★ Featured</span>}</td>
                    <td className="px-4 py-3 text-slate-500">{catLabel}</td>
                    <td className="px-4 py-3 text-slate-500">{p.nationalCoverage ? "National" : p.counties.join(", ")}</td>
                    <td className="px-4 py-3"><Badge variant={p.isActive ? "default" : "secondary"}>{p.isActive ? "Active" : "Inactive"}</Badge></td>
                    <td className="px-4 py-3 text-slate-500">{p.commissionRate != null ? `${p.commissionRate}%` : "—"}</td>
                    <td className="px-4 py-3"><Link href={`/admin/providers/${p.id}`} className="text-brand-700 hover:underline">Edit</Link></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
