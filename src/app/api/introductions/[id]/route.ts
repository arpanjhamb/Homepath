import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { status, aeNote } = await req.json()

  const intro = await prisma.introduction.update({
    where: { id: params.id },
    data: {
      status,
      aeNote,
      handledByAEId: session.user.id,
      sentAt: status === "sent" ? new Date() : undefined,
      completedAt: status === "completed" ? new Date() : undefined,
    },
  })
  return NextResponse.json(intro)
}
