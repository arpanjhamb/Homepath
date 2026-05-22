import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.buyerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const item = await prisma.checklistItem.findFirst({
    where: { id: params.itemId, buyerProfileId: profile.id },
  })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { status } = await req.json()
  const updated = await prisma.checklistItem.update({
    where: { id: params.itemId },
    data: { status, completedAt: status === "completed" ? new Date() : null },
  })

  return NextResponse.json(updated)
}
