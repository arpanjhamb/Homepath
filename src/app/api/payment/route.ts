import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function genRef() {
  return "PAY-" + Math.random().toString(36).substring(2, 10).toUpperCase()
}

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.buyerProfile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (profile.completionFeePaid) return NextResponse.json({ error: "Already paid" }, { status: 409 })

  const reference = genRef()
  await prisma.$transaction([
    prisma.payment.create({
      data: { buyerProfileId: profile.id, amount: 100, currency: "EUR", status: "completed", paymentReference: reference },
    }),
    prisma.buyerProfile.update({
      where: { id: profile.id },
      data: { completionFeePaid: true },
    }),
  ])

  return NextResponse.json({ success: true, reference })
}
