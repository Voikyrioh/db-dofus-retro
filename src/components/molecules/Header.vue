<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import ThemeToggle from '../atoms/ThemeToggle.vue'
import NavDropdown from './NavDropdown.vue'
import QuickSearchDropdown from './QuickSearchDropdown.vue'

const { isLoggedIn, user, logout } = useAuth()

const activeDropdown = ref<string | null>(null)

type Page = 'home' | 'items' | 'crafting-list' | 'crafts' | 'login' | 'register'

function navigate(page: Page): void {
  ;(window as any).navigateTo?.(page)
  activeDropdown.value = null
}

async function handleLogout(): Promise<void> {
  await logout()
  navigate('home')
}

function toggleDropdown(name: string): void {
  activeDropdown.value = activeDropdown.value === name ? null : name
}

function closeDropdowns(): void {
  activeDropdown.value = null
}
</script>

<template>
  <header class="site-header">
    <!-- Barre 1 : Logo + Quicksearch + Controls -->
    <div class="header-top">
      <div class="header-inner">
        <button class="site-logo" @click="navigate('home')">
          ⚔ <span v-translate="'site_title'"></span>
        </button>

        <div class="header-controls">
          <QuickSearchDropdown />
          <ThemeToggle />
          <div class="lang-wrapper">
            <SelectLang />
          </div>
          <template v-if="!isLoggedIn">
            <button class="btn-nav-pill" @click="navigate('login')" v-translate="'nav_login'"></button>
          </template>
          <template v-else>
            <div class="user-avatar" :title="user?.username">
              {{ user?.username?.charAt(0).toUpperCase() }}
            </div>
            <button class="btn-nav-pill btn-nav-pill--logout" @click="handleLogout" v-translate="'nav_logout'"></button>
          </template>
        </div>
      </div>
    </div>

    <!-- Barre 2 : Navigation onglets -->
    <nav class="header-nav" @click.self="closeDropdowns">
      <div class="header-inner header-inner--nav">
        <button class="nav-tab" @click="navigate('home')" v-translate="'nav_home'"></button>

        <NavDropdown
          label="nav_database"
          :is-open="activeDropdown === 'database'"
          @toggle="toggleDropdown('database')"
          @close="closeDropdowns"
        >
          <button class="nav-dropdown-item" @click="navigate('items')" v-translate="'nav_items'"></button>
          <button class="nav-dropdown-item" @click="navigate('crafts')" v-translate="'nav_crafts'"></button>
          <button class="nav-dropdown-item nav-dropdown-item--disabled" disabled v-translate="'nav_monsters'"></button>
        </NavDropdown>

        <NavDropdown
          v-if="isLoggedIn"
          label="nav_tools"
          :is-open="activeDropdown === 'tools'"
          @toggle="toggleDropdown('tools')"
          @close="closeDropdowns"
        >
          <button class="nav-dropdown-item" @click="navigate('crafting-list')" v-translate="'nav_crafting_list'"></button>
        </NavDropdown>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Barre top */
.header-top {
  background: var(--color-bg-nav-top);
  border-bottom: 1px solid var(--color-border-accent);
}
.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.45rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.site-logo {
  background: none;
  border: none;
  color: var(--color-accent);
  font-weight: 800;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
}
.site-logo:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: 3px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lang-wrapper {
  border: 1px solid var(--color-border-accent);
  border-radius: 6px;
  padding: 0.15rem 0.5rem;
}

.btn-nav-pill {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text-nav);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-nav-pill:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.btn-nav-pill--logout:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}
.btn-nav-pill:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-bg-nav);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.75rem;
}

/* Barre nav */
.header-nav {
  background: var(--color-bg-nav);
  border-bottom: 1px solid var(--color-border-accent);
}
.header-inner--nav {
  padding: 0 1.25rem;
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 38px;
}

.nav-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-nav);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.55rem 1rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.nav-tab:hover {
  color: var(--color-text-nav-active);
  border-bottom-color: var(--color-accent);
}
.nav-tab:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.nav-dropdown-item {
  background: none;
  border: none;
  color: var(--color-text-nav);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s, background-color 0.15s;
}
.nav-dropdown-item:hover {
  color: var(--color-text-nav-active);
  background: rgba(212, 168, 92, 0.08);
}
.nav-dropdown-item--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.nav-dropdown-item:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

:deep(select) {
  background: transparent;
  color: var(--color-text-nav);
  font-size: 0.75rem;
  border: none;
  outline: none;
  cursor: pointer;
}
:deep(option) {
  background: var(--color-bg-nav);
  color: var(--color-text-nav);
}
</style>
