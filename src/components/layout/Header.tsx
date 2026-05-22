import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-brand-800 text-lg">
          <Home className="h-5 w-5" />
          HomePath IE
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <Link href="#how-it-works" className="hover:text-brand-700">How it works</Link>
          <Link href="#services" className="hover:text-brand-700">Services</Link>
          <Link href="#pricing" className="hover:text-brand-700">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="outline" size="sm">Log in</Button></Link>
          <Link href="/register"><Button size="sm">Get started</Button></Link>
        </div>
      </div>
    </header>
  )
}
