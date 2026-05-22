import Link from "next/link"
import { Home } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-semibold text-lg mb-2">
              <Home className="h-5 w-5" />
              HomePath IE
            </div>
            <p className="text-sm max-w-xs">Your personalised guide through every step of buying a home in Ireland.</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="text-white font-medium mb-3">Platform</p>
              <ul className="space-y-2">
                <li><Link href="#how-it-works" className="hover:text-white">How it works</Link></li>
                <li><Link href="#services" className="hover:text-white">Services</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-medium mb-3">Legal</p>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 space-y-3 text-xs">
          <p className="text-amber-400 font-medium">Important: HomePath IE is not regulated by the Central Bank of Ireland. We do not provide financial advice, legal advice, mortgage advice, or insurance advice. All provider introductions are made for information purposes only. Always seek independent advice from regulated professionals before making any financial or legal decision.</p>
          <p>© {new Date().getFullYear()} HomePath IE Ltd, Dublin, Ireland. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
