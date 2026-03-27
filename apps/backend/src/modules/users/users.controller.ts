import { Request, Response } from "express";
import { getAdminTechnicians } from "./users.repository";

export async function listTechniciansController(_req: Request, res: Response) {
  try {
    const technicians = await getAdminTechnicians();
    res.json(technicians);
  } catch (error) {
    console.error("Erro ao listar técnicos:", error);
    res.status(500).json({ message: "Erro interno ao buscar técnicos" });
  }
}
