import { Request, Response } from "express"
import { getAdminTechniciansPaginated } from "./users.repository"
import * as usersService from "./users.service"
import * as servicesRepository from "../services/services.repository"
import { updateUserSchema } from "./users.schema"
import { paginationQuerySchema } from "../../shared/pagination.schema"

export async function listUsersController(req: Request, res: Response): Promise<void> {
  try {
    const parsed = paginationQuerySchema.safeParse(req.query)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message, statusCode: 400 })
      return
    }
    const result = await getAdminTechniciansPaginated(parsed.data.cursor, parsed.data.limit)
    res.json(result)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}

export async function getUserController(req: Request, res: Response): Promise<void> {
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

export async function getUserServicesController(
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

export async function updateUserController(req: Request, res: Response): Promise<void> {
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

export async function deleteUserController(req: Request, res: Response): Promise<void> {
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
