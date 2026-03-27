"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Camera, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePhotos, useUploadPhoto, useDeletePhoto } from "@/hooks/use-photos"
import type { Photo } from "@friodesk/shared"

interface PhotoUploadProps {
  serviceId: string
}

export function PhotoUpload({ serviceId }: PhotoUploadProps) {
  const { photos, refetch } = usePhotos(serviceId)
  const { uploadPhoto, uploading } = useUploadPhoto(serviceId)
  const { deletePhoto, deleting } = useDeletePhoto(serviceId)
  const inputRef = useRef<HTMLInputElement>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await uploadPhoto(file)
    if (result) await refetch()
    if (inputRef.current) inputRef.current.value = ""
  }

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return
    const ok = await deletePhoto(confirmDeleteId)
    if (ok) await refetch()
    setConfirmDeleteId(null)
  }

  return (
    <>
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
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 10vw"
                />
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(photo.id)}
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/40 text-red-400 transition-colors hover:bg-black/60 hover:text-red-300"
                  aria-label="Remover foto"
                >
                  <Trash2 className="size-3" />
                </button>
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

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setConfirmDeleteId(null)}
          />
          <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h3 className="font-heading text-lg font-bold">Remover foto</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza que deseja remover esta foto? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting && <Loader2 className="size-4 animate-spin" />}
                Remover
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
