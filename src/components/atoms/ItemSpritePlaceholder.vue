<script setup lang="ts">
defineProps<{
  size?: number
}>()
</script>

<template>
  <svg
    :width="size || 48"
    :height="size || 48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="4" fill="#1F2937" />
    <rect x="4" y="4" width="40" height="40" rx="2" stroke="#4B5563" stroke-width="2" stroke-dasharray="4 4" />
    <circle cx="24" cy="24" r="8" fill="#374151" />
    <path
      d="M24 18v12M18 24h12"
      stroke="#6B7280"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
</template>

<style scoped>
</style>
