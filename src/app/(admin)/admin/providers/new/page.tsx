import { ProviderForm } from "@/components/admin/ProviderForm"

export default function NewProviderPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Add Provider</h1>
      <ProviderForm />
    </div>
  )
}
