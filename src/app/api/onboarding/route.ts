import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateChecklist } from "@/lib/checklist-generator"
import { OnboardingSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = OnboardingSchema.parse(body)

    const profile = await prisma.buyerProfile.update({
      where: { userId: session.user.id },
      data: {
        ...data,
        onboardingStatus: "completed",
      },
    })

    const checklistItems = generateChecklist({
      isFirstTimeBuyer: data.isFirstTimeBuyer,
      hasAIP: data.hasAIP,
      htbAware: data.htbAware,
      propertyTypes: data.propertyTypes,
    })

    await prisma.checklistItem.createMany({
      data: checklistItems.map((item) => ({ ...item, buyerProfileId: profile.id })),
      skipDuplicates: true,
    })

    return NextResponse.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
