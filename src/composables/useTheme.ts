import { ref, watch } from 'vue'

const STORAGE_KEY = 'dofus-theme'

function getInitialDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark') return true
  if (stored === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDark = ref(getInitialDark())

function applyTheme(dark: boolean): void {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
}

// Appliquer immédiatement au chargement du module
applyTheme(isDark.value)

export function useTheme() {
  function toggleTheme(): void {
    isDark.value = !isDark.value
  }

  watch(isDark, applyTheme)

  return { isDark, toggleTheme }
}
