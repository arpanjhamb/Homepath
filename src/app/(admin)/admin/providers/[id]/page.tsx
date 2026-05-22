import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProviderForm } from "@/components/admin/ProviderForm"

export default async function EditProviderPage({ params }: { params: { id: string } }) {
  const provider = await prisma.provider.findUnique({ where: { id: params.id } })
  if (!provider) notFound()
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Provider</h1>
      <ProviderForm provider={provider} />
    </div>
  )
}
