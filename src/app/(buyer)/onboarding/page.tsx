import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard"

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  const profile = await prisma.buyerProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (profile?.onboardingStatus === "completed") redirect("/dashboard")

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Let's set up your journey</h1>
          <p className="text-slate-500 mt-2">This takes about 3 minutes. We'll build your personalised checklist from your answers.</p>
        </div>
        <OnboardingWizard />
      </div>
    </div>
  )
}
