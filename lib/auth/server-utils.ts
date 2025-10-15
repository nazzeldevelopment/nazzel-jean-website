"use server"

import type { User } from "../db/models"
import { storage } from "../db/storage"
import { cookies } from "next/headers"

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value
  if (!token) return null

  const session = await storage.getSessionByToken(token)
  if (!session) return null

  return (await storage.getUserById(session.userId)) || null
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get("authToken")?.value
  if (token) {
    await storage.deleteSession(token)
    cookieStore.delete("authToken")
  }
}

export async function getUserByToken(token: string): Promise<User | null> {
  const session = await storage.getSessionByToken(token)
  if (!session) return null
  return (await storage.getUserById(session.userId)) || null
}
