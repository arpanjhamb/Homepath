import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { MarkSentButton } from "@/components/ae/MarkSentButton"

export default async function AEIntroductionsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const intros = await prisma.introduction.findMany({
    where: { buyerProfile: { assignedAEId: session.user.id } },
    include: {
      buyerProfile: { include: { user: { select: { name: true } } } },
      provider: { select: { name: true, category: true } },
    },
    orderBy: [{ status: "asc" }, { requestedAt: "desc" }],
  })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Introductions</h1>
      {intros.length === 0 ? (
        <p className="text-slate-500">No introductions yet.</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  {["Buyer", "Provider", "Status", "Requested", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {intros.map((i) => (
                  <tr key={i.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{i.buyerProfile.user.name}</td>
                    <td className="px-4 py-3 text-slate-600">{i.provider.name}</td>
                    <td className="px-4 py-3"><Badge variant={i.status === "requested" ? "secondary" : "default"}>{i.status}</Badge></td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(i.requestedAt)}</td>
                    <td className="px-4 py-3">
                      {i.status === "requested" && <MarkSentButton introId={i.id} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
