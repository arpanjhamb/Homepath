import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BuyerSidebar } from "@/components/layout/BuyerSidebar"

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role !== "buyer") {
    if (session.user.role === "admin") redirect("/admin/dashboard")
    if (session.user.role === "account_executive") redirect("/ae/dashboard")
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      <BuyerSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
