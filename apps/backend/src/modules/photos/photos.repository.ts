import { eq } from "drizzle-orm"
import { db } from "../../db"
import { photos, PhotoInsert, PhotoSelect } from "../../db/schema"

export async function createPhoto(data: PhotoInsert): Promise<PhotoSelect> {
  const result = await db.insert(photos).values(data).returning()
  return result[0]
}

export async function findPhotosByServiceId(
  serviceId: string
): Promise<PhotoSelect[]> {
  return db.select().from(photos).where(eq(photos.serviceId, serviceId))
}

export async function findPhotoById(
  id: string
): Promise<PhotoSelect | undefined> {
  const result = await db
    .select()
    .from(photos)
    .where(eq(photos.id, id))
    .limit(1)
  return result[0]
}

export async function deletePhoto(id: string): Promise<void> {
  await db.delete(photos).where(eq(photos.id, id))
}
