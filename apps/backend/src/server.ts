import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import servicesRoutes from "./modules/services/services.routes";
import photosRoutes from "./modules/photos/photos.routes";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

if (!process.env.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER === "local") {
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
}

app.use("/auth", authRoutes);
app.use("/services", servicesRoutes);
app.use("/services/:id/photos", photosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
