import Link from "next/link"
import { Home } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-800 font-semibold text-lg">
          <Home className="h-5 w-5" />
          HomePath IE
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
      <p className="text-center text-xs text-slate-400 p-4">
        HomePath IE provides guidance and introductions only — not financial, legal, or insurance advice.
      </p>
    </div>
  )
}
