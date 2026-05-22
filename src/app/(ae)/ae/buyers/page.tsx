import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function AEBuyersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const buyers = await prisma.buyerProfile.findMany({
    where: { assignedAEId: session.user.id },
    include: {
      user: { select: { name: true, email: true } },
      checklistItems: true,
    },
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Buyers ({buyers.length})</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Name", "Email", "Stage", "Progress", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => {
                const done = b.checklistItems.filter((i) => i.status === "completed").length
                const total = b.checklistItems.length
                const pct = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{b.user.name}</td>
                    <td className="px-4 py-3 text-slate-500">{b.user.email}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{b.currentStage.replace(/_/g, " ")}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full"><div className="h-1.5 bg-brand-500 rounded-full" style={{ width: `${pct}%` }} /></div>
                        <span className="text-xs text-slate-400 w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Link href={`/ae/buyers/${b.id}`} className="text-brand-700 hover:underline">View</Link></td>
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
