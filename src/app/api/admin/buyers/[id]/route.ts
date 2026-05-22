import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { assignedAEId } = await req.json()
  const profile = await prisma.buyerProfile.update({
    where: { id: params.id },
    data: { assignedAEId: assignedAEId || null },
  })
  return NextResponse.json(profile)
}
