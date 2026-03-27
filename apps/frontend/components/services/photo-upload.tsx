"use client"

import { useRef } from "react"
import Image from "next/image"
import { Camera, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePhotos, useUploadPhoto } from "@/hooks/use-photos"
import type { Photo } from "@field-report/shared"

interface PhotoUploadProps {
  serviceId: string
}

export function PhotoUpload({ serviceId }: PhotoUploadProps) {
  const { photos, refetch } = usePhotos(serviceId)
  const { uploadPhoto, uploading } = useUploadPhoto(serviceId)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await uploadPhoto(file)
    if (result) await refetch()
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Fotos
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {photos.length} foto{photos.length !== 1 ? "s" : ""}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo: Photo) => (
            <div
              key={photo.id}
              className="relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              <Image
                src={photo.url}
                alt="Foto do serviço"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 10vw"
              />
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Camera className="size-4" />
        )}
        {uploading ? "Enviando..." : "Adicionar foto"}
      </Button>
    </div>
  )
}
