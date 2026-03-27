export type UserRole = "admin" | "technician"

export interface User {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt: Date
}

export interface UserPublic {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
}
