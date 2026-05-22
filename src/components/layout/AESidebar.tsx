"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Home, Users, Send, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/ae/dashboard", label: "Dashboard", icon: Home },
  { href: "/ae/buyers", label: "My Buyers", icon: Users },
  { href: "/ae/introductions", label: "Introductions", icon: Send },
]

export function AESidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen">
      <div className="p-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 text-brand-800 font-semibold text-lg">
          <Home className="h-5 w-5" />
          HomePath IE
        </Link>
        <p className="text-xs text-slate-400 mt-1">Account Executive Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            pathname.startsWith(href) ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-50"
          )}>
            <Icon className="h-4 w-4" />{label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-slate-900">{session?.user?.name}</p>
          <p className="text-xs text-slate-400">{session?.user?.email}</p>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut className="h-4 w-4" />Sign out
        </button>
      </div>
    </aside>
  )
}
