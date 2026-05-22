"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Lock } from "lucide-react"
import { toast } from "@/hooks/useToast"

export default function PaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    const res = await fetch("/api/payment", { method: "POST" })
    if (res.ok) {
      const { reference } = await res.json()
      toast({ title: "Payment successful!", description: `Reference: ${reference}` })
      router.push("/payment/success")
    } else {
      toast({ title: "Payment failed", variant: "destructive" })
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Completion Support Fee</h1>
        <p className="text-slate-500 text-sm mt-1">Charged only when you successfully complete your home purchase.</p>
      </div>
      <Card className="border-brand-200 bg-brand-50">
        <CardContent className="p-5 space-y-3">
          <p className="font-semibold text-slate-900">What's included</p>
          {[
            "Personalised home-buying checklist",
            "Dedicated Account Executive throughout",
            "Full provider marketplace access",
            "Unlimited introduction requests",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-brand-600 flex-shrink-0" />
              {f}
            </div>
          ))}
          <div className="border-t border-brand-200 pt-3 flex items-baseline justify-between">
            <span className="font-semibold text-slate-900">Total</span>
            <span className="text-2xl font-bold text-brand-700">€100.00</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Lock className="h-4 w-4" />Payment details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <strong>Demo mode</strong> — No real payment is taken. This is a mock payment flow.
          </div>
          <div className="space-y-1.5">
            <Label>Card number</Label>
            <Input placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" readOnly />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Expiry</Label>
              <Input placeholder="MM/YY" defaultValue="12/27" readOnly />
            </div>
            <div className="space-y-1.5">
              <Label>CVV</Label>
              <Input placeholder="123" defaultValue="123" readOnly />
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={handlePay} disabled={loading}>
            {loading ? "Processing…" : "Pay €100.00"}
          </Button>
          <p className="text-xs text-slate-400 text-center">Payments will be processed via Stripe in production.</p>
        </CardContent>
      </Card>
    </div>
  )
}
