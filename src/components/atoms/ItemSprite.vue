<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ItemSpritePlaceholder from './ItemSpritePlaceholder.vue'

const props = defineProps<{
  category?: string | number
  sprite?: number
  size?: number
}>()

const imgError = ref(false)

const hasValidData = computed(() => props.category !== undefined && props.sprite !== undefined)
const spritePath = computed(() => `/assets/items/${props.category}/${props.sprite}.svg`)

watch(() => [props.category, props.sprite], () => {
  imgError.value = false
})
</script>

<template>
  <div class="item-sprite" :style="{ width: `${size || 48}px`, height: `${size || 48}px` }">
    <ItemSpritePlaceholder v-if="!hasValidData || imgError" :size="size || 48" />
    <img
      v-else
      :src="spritePath"
      :width="size || 48"
      :height="size || 48"
      style="object-fit: contain; width: 100%; height: 100%;"
      @error="imgError = true"
    />
  </div>
</template>

<style scoped>
.item-sprite {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
