import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.buyerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const items = await prisma.checklistItem.findMany({
    where: { buyerProfileId: profile.id },
    orderBy: [{ sortOrder: "asc" }],
  })

  return NextResponse.json(items)
}
