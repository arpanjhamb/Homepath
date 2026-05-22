"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Home, Users, ShoppingBag, Send, DollarSign, UserCog, LogOut, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/admin/buyers", label: "Buyers", icon: Users },
  { href: "/admin/providers", label: "Providers", icon: ShoppingBag },
  { href: "/admin/introductions", label: "Introductions", icon: Send },
  { href: "/admin/commissions", label: "Commissions", icon: DollarSign },
  { href: "/admin/account-executives", label: "Account Executives", icon: UserCog },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 font-semibold text-lg"><Home className="h-5 w-5" />HomePath IE</div>
        <p className="text-xs text-slate-400 mt-1">Admin Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname.startsWith(href) ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
          )}>
            <Icon className="h-4 w-4" />{label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <p className="text-sm font-medium px-3 text-white">{session?.user?.name}</p>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 w-full px-3 py-2 mt-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
          <LogOut className="h-4 w-4" />Sign out
        </button>
      </div>
    </aside>
  )
}
