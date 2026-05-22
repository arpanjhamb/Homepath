import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import {
  CheckCircle2, TrendingUp, Scale, Shield, Search, Truck, Wifi,
  Building2, ClipboardList, CheckSquare, HeartPulse, Layers,
  ArrowRight, Star
} from "lucide-react"

const steps = [
  { n: "01", title: "Register & tell us your goals", desc: "Sign up for free and complete a short onboarding. We build your personalised home-buying checklist based on your situation." },
  { n: "02", title: "Get matched with vetted providers", desc: "Browse our curated marketplace of mortgage brokers, solicitors, surveyors and more. Compare options and request introductions." },
  { n: "03", title: "Complete your journey with confidence", desc: "Your dedicated Account Executive guides you every step of the way, from mortgage application to collecting your keys." },
]

const services = [
  { icon: TrendingUp, label: "Mortgage Brokers" },
  { icon: Building2, label: "Banks" },
  { icon: Scale, label: "Solicitors" },
  { icon: ClipboardList, label: "Valuers" },
  { icon: Search, label: "Surveyors" },
  { icon: CheckSquare, label: "Snag Inspectors" },
  { icon: Shield, label: "Home Insurance" },
  { icon: HeartPulse, label: "Mortgage Protection" },
  { icon: Layers, label: "Flooring" },
  { icon: Truck, label: "Removal Companies" },
  { icon: Wifi, label: "Broadband & Utilities" },
]

const testimonials = [
  { name: "Aoife & Conor", location: "Dublin", quote: "HomePath made the whole process so much less stressful. Our Account Executive was brilliant — always available and knew exactly what we needed to do next.", stars: 5 },
  { name: "Siobhán M.", location: "Galway", quote: "As a first-time buyer I had no idea where to start. The checklist was a game-changer. I felt in control the whole way through.", stars: 5 },
  { name: "David O'C.", location: "Cork", quote: "Found our solicitor and mortgage broker through HomePath. Both were excellent and the introductions happened within 24 hours.", stars: 5 },
]

const faqs = [
  { q: "Is HomePath IE free to use?", a: "Yes — the platform is completely free for buyers during your journey. A one-time €100 completion support fee applies when you successfully complete your home purchase." },
  { q: "Does HomePath provide financial or legal advice?", a: "No. HomePath IE is a concierge and introduction service only. We help you understand the process and connect you with regulated professionals. All financial, legal, and insurance advice is provided by those regulated professionals directly." },
  { q: "How are providers vetted?", a: "All providers on our platform are reviewed by our team before listing. We check qualifications, regulatory status, and client feedback. However, we recommend you conduct your own due diligence before engaging any provider." },
  { q: "What is the €100 completion fee for?", a: "The €100 fee covers the full cost of your personalised journey — your Account Executive support, checklist, and marketplace access throughout the entire buying process. It is only charged on successful completion." },
  { q: "What if I'm buying a new build?", a: "HomePath supports new build purchases too. Your checklist will include snag inspection steps and our marketplace includes specialist new build snag inspectors." },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-brand-600/40 text-brand-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Ireland's home-buying concierge platform
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Your guide through every step of buying a home in Ireland
          </h1>
          <p className="text-xl text-brand-100 mb-10 max-w-2xl mx-auto">
            We give you a personalised checklist, a dedicated Account Executive, and introductions to vetted mortgage brokers, solicitors, surveyors and more — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-brand-800 hover:bg-brand-50 w-full sm:w-auto">
                Start your journey — it's free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                See how it works
              </Button>
            </a>
          </div>
          <p className="mt-6 text-brand-200 text-sm">Free to use · No financial advice · €100 completion fee only on success</p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How HomePath works</h2>
            <p className="text-slate-500 text-lg">Three simple steps from registration to keys in hand.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="text-5xl font-bold text-brand-100 mb-4">{s.n}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Every provider you need, in one place</h2>
            <p className="text-slate-500 text-lg">Compare vetted providers across all key categories of your home-buying journey.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {services.map(({ icon: Icon, label }) => (
              <Card key={label} className="hover:border-brand-300 transition-colors">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="h-10 w-10 bg-brand-100 rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5 text-brand-700" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Irish home buyers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <CardContent className="p-0 space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-brand-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
          <Card className="mt-8 border-brand-200">
            <CardContent className="p-8 space-y-6">
              <div>
                <p className="text-5xl font-bold text-brand-700">€100</p>
                <p className="text-slate-500 mt-1">one-time completion fee</p>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 text-left">
                {[
                  "Personalised home-buying checklist",
                  "Dedicated Account Executive throughout",
                  "Full provider marketplace access",
                  "Unlimited introduction requests",
                  "Only charged on successful completion",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full" size="lg">Start for free — pay only when you complete</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Frequently asked questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-slate-200 rounded-xl p-5">
                <p className="font-semibold text-slate-900 mb-2">{f.q}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to start your home-buying journey?</h2>
          <p className="text-brand-200 mb-8">Join hundreds of Irish buyers who've used HomePath to navigate the process with confidence.</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-brand-800 hover:bg-brand-50">
              Get started for free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
