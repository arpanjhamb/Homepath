import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { IntroductionRequestSchema } from "@/lib/validations"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.buyerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json([], { status: 200 })

  const introductions = await prisma.introduction.findMany({
    where: { buyerProfileId: profile.id },
    include: { provider: { select: { id: true, name: true, category: true, shortBio: true } } },
    orderBy: { requestedAt: "desc" },
  })
  return NextResponse.json(introductions)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.buyerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

  try {
    const body = await req.json()
    const data = IntroductionRequestSchema.parse(body)

    const existing = await prisma.introduction.findUnique({
      where: { buyerProfileId_providerId: { buyerProfileId: profile.id, providerId: data.providerId } },
    })
    if (existing) return NextResponse.json({ error: "Introduction already requested" }, { status: 409 })

    const intro = await prisma.introduction.create({
      data: { buyerProfileId: profile.id, providerId: data.providerId, buyerNote: data.buyerNote },
    })
    return NextResponse.json(intro, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
