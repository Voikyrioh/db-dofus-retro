<script setup lang="ts">
defineProps<{
  size?: number
}>()
</script>

<template>
  <svg
    :width="size || 20"
    :height="size || 20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="9" fill="#374151" stroke="#4B5563" stroke-width="1" />
    <text
      x="10"
      y="14"
      text-anchor="middle"
      font-size="12"
      font-weight="bold"
      fill="#6B7280"
    >
      ?
    </text>
  </svg>
</template>

<style scoped>
</style>
