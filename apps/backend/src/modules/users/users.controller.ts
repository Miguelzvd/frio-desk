import { Request, Response } from "express"
import { getAdminTechnicians } from "./users.repository"
import * as usersService from "./users.service"
import { updateUserSchema } from "./users.schema"

export async function listUsersController(_req: Request, res: Response): Promise<void> {
  try {
    const technicians = await getAdminTechnicians()
    res.json(technicians)
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
    const services = await usersService.getUserServices(req.params.id as string)
    res.json(services)
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
