<script setup lang="ts">
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="theme-toggle"
    :title="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
    @click="toggleTheme"
  >
    <span v-if="isDark">☀</span>
    <span v-else>🌙</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: transparent;
  border: 1px solid var(--color-border-accent);
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-text-nav);
  line-height: 1;
  transition: border-color 0.15s, color 0.15s;
}
.theme-toggle:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.theme-toggle:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
