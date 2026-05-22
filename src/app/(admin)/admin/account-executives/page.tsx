import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

export default async function AdminAEsPage() {
  const aes = await prisma.user.findMany({
    where: { role: "account_executive" },
    include: { _count: { select: { assignedBuyers: true } } },
    orderBy: { createdAt: "asc" },
  })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Account Executives ({aes.length})</h1>
        <Link href="/admin/account-executives/new"><Button>Add AE</Button></Link>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                {["Name", "Email", "Buyers assigned", "Joined"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aes.map((ae) => (
                <tr key={ae.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{ae.name}</td>
                  <td className="px-4 py-3 text-slate-500">{ae.email}</td>
                  <td className="px-4 py-3 text-center">{ae._count.assignedBuyers}</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(ae.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
