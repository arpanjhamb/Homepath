import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { ProviderCategory } from "@prisma/client"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category") as ProviderCategory | null
  const county = searchParams.get("county")

  const providers = await prisma.provider.findMany({
    where: {
      isActive: true,
      ...(category ? { category } : {}),
      ...(county ? { OR: [{ nationalCoverage: true }, { counties: { has: county } }] } : {}),
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true, name: true, category: true, shortBio: true, description: true,
      logoUrl: true, website: true, counties: true, nationalCoverage: true, featured: true,
    },
  })

  return NextResponse.json(providers)
}
