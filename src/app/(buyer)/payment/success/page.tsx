import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8 space-y-4">
          <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Payment successful!</h1>
          <p className="text-slate-500">Thank you for completing your journey with HomePath IE. Your reference has been emailed to you.</p>
          <Link href="/dashboard"><Button className="w-full mt-2">Back to dashboard</Button></Link>
        </CardContent>
      </Card>
    </div>
  )
}
