import { ref, computed } from 'vue'

const STORAGE_KEY = 'dofus-auth-token'
const token = ref<string | null>(localStorage.getItem(STORAGE_KEY))

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

  function logout() {
    token.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { token, isLoggedIn, setTokenFromCookie, logout }
}
