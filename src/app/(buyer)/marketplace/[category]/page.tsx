import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProviderCategory } from "@prisma/client"
import { PROVIDER_CATEGORIES } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { IntroductionButton } from "@/components/marketplace/IntroductionButton"
import { MapPin, Globe, Star } from "lucide-react"

interface Props { params: { category: string } }

export default async function CategoryPage({ params }: Props) {
  const catKey = params.category as ProviderCategory
  if (!Object.values(ProviderCategory).includes(catKey)) notFound()

  const catMeta = PROVIDER_CATEGORIES.find((c) => c.key === catKey)
  const providers = await prisma.provider.findMany({
    where: { category: catKey, isActive: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    select: {
      id: true, name: true, category: true, shortBio: true, description: true,
      counties: true, nationalCoverage: true, featured: true, website: true,
    },
  })

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/marketplace" className="hover:text-brand-700">Marketplace</Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">{catMeta?.label ?? catKey}</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{catMeta?.label}</h1>
        <p className="text-slate-500 text-sm mt-1">{catMeta?.description}</p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        HomePath IE provides introductions only — not financial, legal, or insurance advice.
      </div>
      {providers.length === 0 ? (
        <p className="text-slate-500 py-8 text-center">No providers listed in this category yet.</p>
      ) : (
        <div className="space-y-4">
          {providers.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{p.name}</h3>
                      {p.featured && <Badge><Star className="h-3 w-3 mr-1" />Featured</Badge>}
                    </div>
                    <p className="text-sm text-slate-600">{p.shortBio}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      {p.nationalCoverage ? (
                        <><Globe className="h-3 w-3" /> National coverage</>
                      ) : (
                        <><MapPin className="h-3 w-3" /> {p.counties.join(", ")}</>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <IntroductionButton providerId={p.id} providerName={p.name} />
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-xs text-center text-brand-700 hover:underline">
                        Visit website
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
