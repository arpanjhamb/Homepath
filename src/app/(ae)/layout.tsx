import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { AESidebar } from "@/components/layout/AESidebar"

export default async function AELayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  if (session.user.role !== "account_executive" && session.user.role !== "admin") redirect("/dashboard")
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AESidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
