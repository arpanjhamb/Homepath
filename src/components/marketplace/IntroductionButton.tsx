"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/hooks/useToast"
import { Send } from "lucide-react"

interface Props { providerId: string; providerName: string }

export function IntroductionButton({ providerId, providerName }: Props) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function requestIntro() {
    setLoading(true)
    const res = await fetch("/api/introductions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId, buyerNote: note }),
    })
    if (res.ok) {
      setSent(true)
      setOpen(false)
      toast({ title: "Introduction requested!", description: `We'll connect you with ${providerName} shortly.` })
    } else if (res.status === 409) {
      toast({ title: "Already requested", description: "You've already requested an introduction to this provider." })
      setSent(true)
      setOpen(false)
    } else {
      toast({ title: "Something went wrong", variant: "destructive" })
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <Button size="sm" variant="secondary" disabled>
        <Send className="h-3 w-3 mr-1.5" /> Requested
      </Button>
    )
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Send className="h-3 w-3 mr-1.5" /> Request Introduction
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request introduction to {providerName}</DialogTitle>
            <DialogDescription>
              We'll introduce you to this provider. This is an introduction only — not financial, legal, or insurance advice.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Add a note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g. I'm a first-time buyer looking for a mortgage around €350,000…"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 resize-none"
              />
            </div>
            <p className="text-xs text-slate-400">HomePath IE is not responsible for advice given by providers. Always seek independent professional advice.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={requestIntro} disabled={loading}>
                {loading ? "Sending…" : "Send Introduction Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
