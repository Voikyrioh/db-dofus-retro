import { API_BASE_URL } from '../constants/api'
import type { AuthCredentials } from '../entities/AuthCredentials'
import type { RegisterData } from '../entities/RegisterData'

export async function register(data: RegisterData): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error(`Failed to register: ${response.statusText}`)
}

export async function login(credentials: AuthCredentials): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials)
  })
  if (!response.ok) throw new Error(`Failed to login: ${response.statusText}`)
}
