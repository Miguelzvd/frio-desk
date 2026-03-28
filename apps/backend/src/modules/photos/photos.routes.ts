import { Router } from "express"
import multer from "multer"
import { authMiddleware } from "../../middlewares/auth"
import * as photosController from "./photos.controller"

const router = Router({ mergeParams: true })

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Apenas imagens são permitidas"))
      return
    }
    cb(null, true)
  },
})

router.use(authMiddleware)

router.get("/", photosController.getPhotosByServiceId)
router.post("/", upload.single("photo"), photosController.uploadPhoto)
router.delete("/:photoId", photosController.deletePhoto)

export default router
