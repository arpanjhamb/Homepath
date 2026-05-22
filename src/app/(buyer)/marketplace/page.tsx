import { prisma } from "@/lib/prisma"
import { PROVIDER_CATEGORIES } from "@/lib/constants"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Building2, Scale, ClipboardList, Search, CheckSquare, Shield, HeartPulse, Layers, Truck, Wifi } from "lucide-react"

const ICONS: Record<string, React.ElementType> = {
  TrendingUp, Building2, Scale, ClipboardList, Search, CheckSquare, Shield, HeartPulse, Layers, Truck, Wifi,
}

export default async function MarketplacePage() {
  const counts = await prisma.provider.groupBy({
    by: ["category"],
    where: { isActive: true },
    _count: true,
  })
  const countMap = Object.fromEntries(counts.map((c) => [c.category, c._count]))

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Provider Marketplace</h1>
        <p className="text-slate-500 text-sm mt-1">Compare vetted providers across all categories of your home-buying journey.</p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>Important:</strong> HomePath IE provides introductions only — not financial, legal, or insurance advice. Always seek independent professional advice from regulated professionals.
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {PROVIDER_CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.icon] ?? Building2
          const count = countMap[cat.key] ?? 0
          return (
            <Link key={cat.key} href={`/marketplace/${cat.key}`}>
              <Card className="hover:border-brand-300 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 bg-brand-100 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{cat.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{count} provider{count !== 1 ? "s" : ""}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
