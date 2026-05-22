import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default async function AdminIntroductionsPage() {
  const intros = await prisma.introduction.findMany({
    include: {
      buyerProfile: { include: { user: { select: { name: true } } } },
      provider: { select: { name: true, category: true } },
      handledByAE: { select: { name: true } },
    },
    orderBy: { requestedAt: "desc" },
  })

  const statusColor: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    requested: "secondary",
    sent: "default",
    responded: "default",
    completed: "default",
    cancelled: "destructive",
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Introductions ({intros.length})</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Buyer", "Provider", "Status", "Handled by", "Requested"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {intros.map((i) => (
                <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{i.buyerProfile.user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{i.provider.name}</td>
                  <td className="px-4 py-3"><Badge variant={statusColor[i.status] ?? "secondary"}>{i.status}</Badge></td>
                  <td className="px-4 py-3 text-slate-500">{i.handledByAE?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(i.requestedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
