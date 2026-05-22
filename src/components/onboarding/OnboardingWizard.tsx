"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/useToast"
import { IRISH_COUNTIES } from "@/lib/constants"

const BUDGET_OPTIONS = [
  { label: "€150,000 – €200,000", min: 150000, max: 200000 },
  { label: "€200,000 – €250,000", min: 200000, max: 250000 },
  { label: "€250,000 – €350,000", min: 250000, max: 350000 },
  { label: "€350,000 – €450,000", min: 350000, max: 450000 },
  { label: "€450,000 – €600,000", min: 450000, max: 600000 },
  { label: "€600,000 – €800,000", min: 600000, max: 800000 },
  { label: "€800,000+", min: 800000, max: 2000000 },
]

const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "3_months", label: "Within 3 months" },
  { value: "6_months", label: "Within 6 months" },
  { value: "12_months", label: "Within 12 months" },
  { value: "not_sure", label: "Not sure yet" },
]

interface FormData {
  phone: string
  budgetMin: number
  budgetMax: number
  depositAmount: number
  hasAIP: boolean
  preferredCounties: string[]
  propertyTypes: string[]
  minBedrooms: number
  timeline: string
  isFirstTimeBuyer: boolean
  htbAware: boolean
}

const STEPS = ["About you", "Budget", "Location", "Property", "Timeline", "Review"]

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormData>({
    phone: "",
    budgetMin: 250000,
    budgetMax: 350000,
    depositAmount: 30000,
    hasAIP: false,
    preferredCounties: [],
    propertyTypes: [],
    minBedrooms: 2,
    timeline: "6_months",
    isFirstTimeBuyer: true,
    htbAware: false,
  })

  const progress = ((step + 1) / STEPS.length) * 100
  const update = (patch: Partial<FormData>) => setForm((f) => ({ ...f, ...patch }))

  const toggleArr = (key: keyof FormData, val: string) => {
    const arr = form[key] as string[]
    update({ [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] } as Partial<FormData>)
  }

  async function submit() {
    setSubmitting(true)
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast({ title: "All set!", description: "Your personalised checklist is ready." })
      router.push("/dashboard")
      router.refresh()
    } else {
      toast({ title: "Something went wrong", variant: "destructive" })
      setSubmitting(false)
    }
  }

  const chip = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
        active ? "bg-brand-700 text-white border-brand-700" : "bg-white text-slate-700 border-slate-300 hover:border-brand-400"
      }`}
    >
      {label}
    </button>
  )

  const steps = [
    // Step 0: About you
    <div key="about" className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone number (optional)</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update({ phone: e.target.value })}
          placeholder="+353 87 123 4567"
          className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Are you a first-time buyer?</label>
        <div className="flex gap-3">
          {chip("Yes — first-time buyer", form.isFirstTimeBuyer, () => update({ isFirstTimeBuyer: true }))}
          {chip("No — I've owned before", !form.isFirstTimeBuyer, () => update({ isFirstTimeBuyer: false }))}
        </div>
        {form.isFirstTimeBuyer && (
          <p className="mt-3 text-sm text-brand-700 bg-brand-50 rounded-lg p-3">
            As a first-time buyer you may be eligible for the Help-to-Buy scheme (up to €30,000 tax refund towards your deposit).
          </p>
        )}
      </div>
      {form.isFirstTimeBuyer && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Are you aware of the Help-to-Buy (HTB) scheme?</label>
          <div className="flex gap-3">
            {chip("Yes, I know about it", form.htbAware, () => update({ htbAware: true }))}
            {chip("No, tell me more", !form.htbAware, () => update({ htbAware: false }))}
          </div>
        </div>
      )}
    </div>,

    // Step 1: Budget
    <div key="budget" className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">What is your target budget?</label>
        <div className="grid grid-cols-2 gap-2">
          {BUDGET_OPTIONS.map((opt) => chip(
            opt.label,
            form.budgetMin === opt.min && form.budgetMax === opt.max,
            () => update({ budgetMin: opt.min, budgetMax: opt.max })
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">In Ireland, lenders typically offer up to 3.5× your gross salary.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Approximate deposit saved (€)</label>
        <input
          type="number"
          value={form.depositAmount}
          onChange={(e) => update({ depositAmount: Number(e.target.value) })}
          className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
        <p className="text-xs text-slate-400 mt-1">First-time buyers typically need at least 10% deposit.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Do you have Approval in Principle (AIP)?</label>
        <div className="flex gap-3">
          {chip("Yes, I have AIP", form.hasAIP, () => update({ hasAIP: true }))}
          {chip("Not yet", !form.hasAIP, () => update({ hasAIP: false }))}
        </div>
        {!form.hasAIP && (
          <p className="mt-2 text-sm text-slate-500">No problem — getting AIP is one of the first steps in your checklist.</p>
        )}
      </div>
    </div>,

    // Step 2: Location
    <div key="location" className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Which counties are you searching in? (select all that apply)</label>
        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
          {IRISH_COUNTIES.map((c) => chip(c, form.preferredCounties.includes(c), () => toggleArr("preferredCounties", c)))}
        </div>
        {form.preferredCounties.length === 0 && (
          <p className="text-xs text-red-500 mt-2">Please select at least one county.</p>
        )}
      </div>
    </div>,

    // Step 3: Property type
    <div key="property" className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">What type of property are you looking for?</label>
        <div className="flex flex-wrap gap-2">
          {["house", "apartment", "new_build", "townhouse", "bungalow"].map((t) =>
            chip(t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()), form.propertyTypes.includes(t), () => toggleArr("propertyTypes", t))
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Minimum number of bedrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => chip(`${n}${n === 5 ? "+" : ""}`, form.minBedrooms === n, () => update({ minBedrooms: n })))}
        </div>
      </div>
    </div>,

    // Step 4: Timeline
    <div key="timeline" className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">When are you hoping to complete your purchase?</label>
        <div className="space-y-2">
          {TIMELINE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ timeline: opt.value })}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                form.timeline === opt.value ? "bg-brand-700 text-white border-brand-700" : "bg-white text-slate-700 border-slate-300 hover:border-brand-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 5: Review
    <div key="review" className="space-y-4">
      <p className="text-sm text-slate-500">Here's a summary of your details. You can always update these later.</p>
      {[
        { label: "Buyer type", value: form.isFirstTimeBuyer ? "First-time buyer" : "Previous owner" },
        { label: "Budget", value: BUDGET_OPTIONS.find((o) => o.min === form.budgetMin)?.label ?? "—" },
        { label: "Deposit saved", value: `€${form.depositAmount.toLocaleString()}` },
        { label: "Has AIP", value: form.hasAIP ? "Yes" : "Not yet" },
        { label: "Searching in", value: form.preferredCounties.join(", ") || "—" },
        { label: "Property types", value: form.propertyTypes.join(", ") || "—" },
        { label: "Min bedrooms", value: String(form.minBedrooms) },
        { label: "Timeline", value: TIMELINE_OPTIONS.find((o) => o.value === form.timeline)?.label ?? "—" },
      ].map(({ label, value }) => (
        <div key={label} className="flex justify-between py-2 border-b border-slate-100 text-sm">
          <span className="text-slate-500">{label}</span>
          <span className="font-medium text-slate-900">{value}</span>
        </div>
      ))}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mt-4">
        <p className="text-sm text-brand-800 font-medium">What happens next?</p>
        <p className="text-sm text-brand-700 mt-1">We'll generate your personalised step-by-step checklist and assign you a dedicated Account Executive.</p>
      </div>
    </div>,
  ]

  const canProceed = () => {
    if (step === 2 && form.preferredCounties.length === 0) return false
    if (step === 3 && form.propertyTypes.length === 0) return false
    return true
  }

  return (
    <Card>
      <CardContent className="p-8">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Step {step + 1} of {STEPS.length}</span>
            <span>{STEPS[step]}</span>
          </div>
          <Progress value={progress} />
          <div className="flex justify-between mt-3">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-xs font-medium ${i === step ? "text-brand-700" : i < step ? "text-brand-500" : "text-slate-300"}`}>
                {s}
              </span>
            ))}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-900 mb-6">{STEPS[step]}</h2>
        {steps[step]}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Continue
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Building your checklist…" : "Start my journey"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
