import { API_BASE_URL } from '../constants/api'
import type { AuthCredentials } from '../entities/AuthCredentials'
import type { RegisterData } from '../entities/RegisterData'
import type { AuthUser } from '../entities/AuthUser'

async function parseAuthError(response: Response): Promise<never> {
  const text = await response.text()
  let json: unknown
  try { json = JSON.parse(text) } catch { throw new Error(text || response.statusText) }
  if (json && typeof json === 'object' && 'errors' in json && Array.isArray((json as { errors: unknown }).errors)) {
    const msgs = (json as { errors: { field: string; code: string }[] }).errors.map(e => `${e.field}: ${e.code}`)
    throw new Error(msgs.join(', '))
  }
  throw new Error(typeof json === 'string' ? json : (text || response.statusText))
}

export async function register(data: RegisterData): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) return parseAuthError(response)
  return response.json()
}

export async function login(credentials: AuthCredentials): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials)
  })
  if (!response.ok) return parseAuthError(response)
  return response.json()
}

export async function logoutRequest(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, { credentials: 'include' })
}
