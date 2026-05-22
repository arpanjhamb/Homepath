import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default async function AdminBuyersPage() {
  const buyers = await prisma.buyerProfile.findMany({
    include: {
      user: { select: { name: true, email: true } },
      assignedAE: { select: { name: true } },
      _count: { select: { introductions: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Buyers ({buyers.length})</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Name", "Email", "Status", "AE Assigned", "Introductions", "Joined", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{b.user.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{b.user.email}</td>
                  <td className="px-4 py-3"><Badge variant={b.onboardingStatus === "completed" ? "default" : "secondary"}>{b.onboardingStatus}</Badge></td>
                  <td className="px-4 py-3 text-slate-500">{b.assignedAE?.name ?? <span className="text-amber-600">Unassigned</span>}</td>
                  <td className="px-4 py-3 text-center">{b._count.introductions}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(b.createdAt)}</td>
                  <td className="px-4 py-3"><Link href={`/admin/buyers/${b.id}`} className="text-brand-700 hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
