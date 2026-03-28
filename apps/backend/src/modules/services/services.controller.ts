import { Request, Response } from "express";
import { z } from "zod";
import {
  createServiceSchema,
  updateServiceSchema,
  paginationQuerySchema,
} from "./services.schema";
import * as servicesService from "./services.service";
import * as servicesRepository from "./services.repository";

export async function registerService(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsed = createServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0].message, statusCode: 400 });
      return;
    }

    const service = await servicesService.createService(
      req.user!.userId,
      parsed.data.type,
    );
    res.status(201).json(service);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 });
  }
}

export async function getAllServices(req: Request, res: Response): Promise<void> {
  try {
    const parsed = paginationQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0].message, statusCode: 400 });
      return;
    }
    const services = await servicesService.getAllServices(
      req.user!.userId,
      req.user!.role,
      { cursor: parsed.data.cursor, limit: parsed.data.limit },
      req.query.type as string | undefined,
      req.query.status as string | undefined,
    );
    res.status(200).json(services);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 });
  }
}

export async function getServiceById(req: Request, res: Response): Promise<void> {
  try {
    const service = await servicesService.getServiceDetail(
      req.params.id as string,
      req.user!.userId,
      req.user!.role,
    );
    res.status(200).json(service);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 });
  }
}

export async function updateService(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsed = updateServiceSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0].message, statusCode: 400 });
      return;
    }

    const service = await servicesService.updateService(
      req.params.id as string,
      req.user!.userId,
      parsed.data,
    );
    res.status(200).json(service);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 });
  }
}

export async function deleteService(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    await servicesService.deleteService(
      req.params.id as string,
      req.user!.userId,
    );
    res.status(204).send();
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 });
  }
}

export async function getMetricsController(req: Request, res: Response) {
  try {
    const metrics = await servicesRepository.getAdminMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Erro ao buscar métricas do admin:", error);
    res.status(500).json({ message: "Erro interno ao buscar métricas" });
  }
}

const toggleChecklistSchema = z.object({
  checked: z.boolean(),
});

export async function toggleChecklistItemController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsed = toggleChecklistSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0].message, statusCode: 400 });
      return;
    }
    const item = await servicesRepository.updateChecklistItem(
      req.params.itemId as string,
      parsed.data.checked,
    );
    if (!item) {
      res.status(404).json({ error: "Item não encontrado", statusCode: 404 });
      return;
    }
    res.json(item);
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 });
  }
}
