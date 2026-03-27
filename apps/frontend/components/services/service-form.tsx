"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SERVICE_TYPE_LABELS } from "@/lib/constants"
import { useCreateService } from "@/hooks/use-services"
import type { ServiceType } from "@field-report/shared"

const SERVICE_TYPES: ServiceType[] = [
  "preventiva",
  "corretiva",
  "instalação",
  "inspeção",
]

const schema = z.object({
  type: z.enum(["preventiva", "corretiva", "instalação", "inspeção"] as const),
})

type FormValues = z.infer<typeof schema>

export function ServiceForm() {
  const router = useRouter()
  const { createService, loading } = useCreateService()

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    const service = await createService(data.type)
    if (service) {
      router.push(`/services/${service.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de serviço</Label>
        <Select onValueChange={(val) => setValue("type", val as ServiceType)}>
          <SelectTrigger id="type" className="w-full">
            <SelectValue placeholder="Selecione o tipo..." />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {SERVICE_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-xs text-destructive">{errors.type.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Criando..." : "Criar serviço"}
      </Button>
    </form>
  )
}
