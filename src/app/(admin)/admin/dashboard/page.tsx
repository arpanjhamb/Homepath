import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Users, ShoppingBag, Send, DollarSign, ArrowRight } from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const [buyers, providers, introductions, payments] = await Promise.all([
    prisma.buyerProfile.count(),
    prisma.provider.count({ where: { isActive: true } }),
    prisma.introduction.count(),
    prisma.payment.aggregate({ where: { status: "completed" }, _sum: { amount: true }, _count: true }),
  ])

  const recentBuyers = await prisma.buyerProfile.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  })

  const pendingIntros = await prisma.introduction.count({ where: { status: "requested" } })

  const stats = [
    { label: "Total buyers", value: buyers, icon: Users, href: "/admin/buyers", color: "text-brand-700" },
    { label: "Active providers", value: providers, icon: ShoppingBag, href: "/admin/providers", color: "text-blue-700" },
    { label: "Total introductions", value: introductions, icon: Send, href: "/admin/introductions", color: "text-purple-700" },
    { label: "Revenue (EUR)", value: `€${(payments._sum.amount ?? 0).toFixed(0)}`, icon: DollarSign, href: "/admin/commissions", color: "text-green-700" },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Platform summary and recent activity.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </div>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-sm text-slate-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {pendingIntros > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <p className="text-amber-800 font-medium">{pendingIntros} introduction{pendingIntros > 1 ? "s" : ""} awaiting action</p>
          <Link href="/admin/introductions" className="text-amber-700 hover:underline text-sm font-medium">View →</Link>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent buyers</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentBuyers.map((b) => (
              <Link key={b.id} href={`/admin/buyers/${b.id}`} className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg -mx-2">
                <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-semibold">{b.user.name?.[0] ?? "?"}</div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{b.user.name}</p>
                  <p className="text-xs text-slate-400">{b.onboardingStatus}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Quick actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { href: "/admin/providers/new", label: "Add a new provider" },
              { href: "/admin/account-executives/new", label: "Add an Account Executive" },
              { href: "/admin/introductions", label: "Review pending introductions" },
              { href: "/admin/commissions", label: "View commissions" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-brand-50 transition-colors">
                <span className="text-sm text-slate-700">{label}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
