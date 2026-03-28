import { Request, Response } from "express"
import { findAdminTechniciansPaginated } from "./users.repository"
import * as usersService from "./users.service"
import * as servicesRepository from "../services/services.repository"
import { updateUserSchema, createUserSchema } from "./users.schema"
import { paginationQuerySchema } from "../../shared/pagination.schema"

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0].message,
        statusCode: 400,
      });
      return;
    }

    const { name, email, password } = parsed.data;
    const user = await usersService.createUser(name, email, password);
    
    res.status(201).json({ user });
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode ?? 500;
    res.status(statusCode).json({ error: error.message, statusCode });
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const parsed = paginationQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message, statusCode: 400 })
      return
    }
    const result = await findAdminTechniciansPaginated(parsed.data.cursor, parsed.data.limit)
    res.json(result)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const user = await usersService.getUserById(req.params.id as string)
    res.json(user)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}

export async function getUserServices(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsed = paginationQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message, statusCode: 400 })
      return
    }
    const result = await servicesRepository.findServicesByUserIdPaginated(
      req.params.id as string,
      parsed.data.cursor,
      parsed.data.limit,
    )
    res.json(result)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const parsed = updateUserSchema.safeParse(req.body)
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues[0].message, statusCode: 400 })
      return
    }
    const user = await usersService.updateUser(req.params.id as string, parsed.data)
    res.json(user)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    await usersService.deleteUser(req.params.id as string)
    res.status(204).send()
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}
