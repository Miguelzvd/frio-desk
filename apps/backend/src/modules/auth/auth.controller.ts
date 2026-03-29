import { Request, Response } from "express";
import * as authService from "./auth.service";
import * as usersService from "../users/users.service";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schema";
import { clearToken, setToken } from "./auth.utils";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0].message,
        statusCode: 400,
      });
      return;
    }

    const { name, email, password } = parsed.data;
    const result = await authService.register(name, email, password);
    
    setToken(res, "accessToken", result.tokens.accessToken);

    if (result.tokens.refreshToken) {
      setToken(res, "refreshToken", result.tokens.refreshToken);
    }

    res.status(201).json({ user: result.user });
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode ?? 500;
    res.status(statusCode).json({ error: error.message, statusCode });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0].message,
        statusCode: 400,
      });
      return;
    }

    const { email, password } = parsed.data;
    const result = await authService.login(email, password);


    setToken(res, "accessToken", result.tokens.accessToken);

    if (result.tokens.refreshToken) {
      setToken(res, "refreshToken", result.tokens.refreshToken);
    }

    res.status(200).json({ user: result.user });
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode ?? 500;
    res.status(statusCode).json({ error: error.message, statusCode });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const tokenSource = {
      refreshToken: req.body?.refreshToken || req.cookies?.refreshToken,
    };
    
    if (!tokenSource.refreshToken) {
       res.status(401).json({ error: "Refresh token não fornecido", statusCode: 401 });
       return;
    }

    const parsed = refreshSchema.safeParse(tokenSource);
    
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.issues[0].message,
        statusCode: 400,
      });
      return;
    }

    const refreshToken = parsed.data.refreshToken;
    const tokens = await authService.refresh(refreshToken);
    
    setToken(res, "accessToken", tokens.accessToken);
    setToken(res, "refreshToken", tokens.refreshToken);

    res.status(200).json({ success: true });
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    const statusCode = error.statusCode ?? 500;
    res.status(statusCode).json({ error: error.message, statusCode });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  clearToken(res, "accessToken");
  clearToken(res, "refreshToken");
  
  res.status(200).json({ success: true });
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Não autorizado", statusCode: 401 });
    return;
  }
  
  try {
    const user = await usersService.getUserById(req.user.userId);
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: "Usuário não encontrado", statusCode: 401 });
  }
}
