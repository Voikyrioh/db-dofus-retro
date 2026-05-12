<script setup lang="ts">
defineProps<{
  width?: string
  height?: string
  rounded?: boolean
}>()
</script>

<template>
  <div
    class="skeleton"
    :style="{
      width: width ?? '100%',
      height: height ?? '1rem',
      borderRadius: rounded ? '999px' : undefined
    }"
    aria-hidden="true"
  ></div>
</template>

<style scoped>
</style>
