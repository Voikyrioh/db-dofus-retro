<script setup lang="ts">
defineProps<{
  label: string
  isOpen: boolean
}>()

defineEmits<{
  toggle: []
  close: []
}>()
</script>

<template>
  <div class="nav-dropdown" @mouseleave="$emit('close')">
    <button
      class="nav-tab nav-tab--dropdown"
      :class="{ 'nav-tab--active': isOpen }"
      @click="$emit('toggle')"
    >
      <span v-translate="label"></span>
      <span class="arrow">▾</span>
    </button>
    <div v-if="isOpen" class="dropdown-menu">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.nav-dropdown {
  position: relative;
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
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
  height: 100%;
}
.nav-tab:hover,
.nav-tab--active {
  color: var(--color-text-nav-active);
  border-bottom-color: var(--color-accent);
}
.nav-tab:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}

.arrow {
  font-size: 0.65rem;
  margin-top: 1px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-bg-nav);
  border: 1px solid var(--color-border-accent);
  border-top: none;
  border-radius: 0 0 8px 8px;
  min-width: 180px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding: 0.3rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
</style>
