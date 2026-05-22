import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const provider = await prisma.provider.findUnique({
    where: { id: params.id, isActive: true },
    select: {
      id: true, name: true, category: true, shortBio: true, description: true,
      logoUrl: true, website: true, email: true, phone: true,
      counties: true, nationalCoverage: true, featured: true,
    },
  })
  if (!provider) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(provider)
}
