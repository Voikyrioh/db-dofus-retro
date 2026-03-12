import { ref, computed } from 'vue'
import type { AuthUser } from '../entities/AuthUser'

const STORAGE_KEY = 'dofus-auth-token'
const USER_STORAGE_KEY = 'dofus-auth-user'

const token = ref<string | null>(localStorage.getItem(STORAGE_KEY))
const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem(USER_STORAGE_KEY) ?? 'null'))

export function getAuthHeaders(): HeadersInit {
  if (!token.value) return {}
  return { Authorization: `Bearer ${token.value}` }
}

export function useAuth() {
  const isLoggedIn = computed(() => token.value !== null)

  function setTokenFromCookie() {
    const match = document.cookie.split('; ').find(row => row.startsWith('access-token='))
    if (match) {
      const value = match.split('=')[1] ?? ''
      token.value = value
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  function setUser(authUser: AuthUser) {
    user.value = authUser
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  return { token, user, isLoggedIn, setTokenFromCookie, setUser, logout }
}
