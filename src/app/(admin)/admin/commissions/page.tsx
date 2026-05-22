import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

export default async function AdminCommissionsPage() {
  const payments = await prisma.payment.findMany({
    include: { buyerProfile: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  })

  const total = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Commissions & Fees</h1>
        <div className="text-right">
          <p className="text-sm text-slate-500">Total revenue</p>
          <p className="text-2xl font-bold text-brand-700">{formatCurrency(total)}</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Buyer", "Amount", "Status", "Reference", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{p.buyerProfile.user.name}</td>
                  <td className="px-4 py-3 font-semibold text-brand-700">{formatCurrency(p.amount)}</td>
                  <td className="px-4 py-3"><Badge variant={p.status === "completed" ? "default" : "secondary"}>{p.status}</Badge></td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">{p.paymentReference ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
