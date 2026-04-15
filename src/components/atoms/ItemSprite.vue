<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ItemSpritePlaceholder from './ItemSpritePlaceholder.vue'

const props = defineProps<{
  category?: number
  sprite?: number
  size?: number
}>()

interface SpriteData {
  content: string
  width: number
  height: number
}

const spriteSvgs = ref<SpriteData[]>([])
const loading = ref(true)
const error = ref(false)
const maxWidth = ref(0)
const maxHeight = ref(0)

const hasValidData = computed(() => {
  return props.category !== undefined && props.sprite !== undefined
})

const containerStyle = computed(() => {
  if (maxWidth.value === 0 || maxHeight.value === 0) {
    return {}
  }

  // Calculate aspect ratio
  const aspectRatio = maxWidth.value / maxHeight.value
  const containerSize = props.size || 48

  let width = containerSize
  let height = containerSize

  if (aspectRatio > 1) {
    // Wider than tall
    height = containerSize / aspectRatio
  } else {
    // Taller than wide
    width = containerSize * aspectRatio
  }

  return {
    width: `${width}px`,
    height: `${height}px`
  }
})

function extractDimensions(svgContent: string): { width: number; height: number } {
  // Extract width and height from SVG content
  const widthMatch = svgContent.match(/width="([0-9.]+)px"/)
  const heightMatch = svgContent.match(/height="([0-9.]+)px"/)

  const width = widthMatch ? parseFloat(widthMatch[1] ?? '0') : 0
  const height = heightMatch ? parseFloat(heightMatch[1] ?? '0') : 0

  return { width, height }
}

async function loadSprites() {
  if (!hasValidData.value) {
    loading.value = false
    error.value = true
    return
  }

  try {
    const basePath = `/assets/items/${props.category}/${props.sprite}`

    // Try to load common sprite file numbers (1.svg, 3.svg, 5.svg, etc.)
    // We'll try files 1-20 and collect the ones that exist
    const loadPromises: Promise<{ index: number; content: string } | null>[] = []

    for (let i = 1; i <= 20; i++) {
      loadPromises.push(
        fetch(`${basePath}/${i}.svg`)
          .then(async (response) => {
            if (response.ok) {
              const content = await response.text()
              return { index: i, content }
            }
            return null
          })
          .catch(() => null)
      )
    }

    const results = await Promise.all(loadPromises)
    const validSprites = results
      .filter((result): result is { index: number; content: string } => result !== null)
      .sort((a, b) => a.index - b.index)

    if (validSprites.length === 0) {
      error.value = true
    } else {
      // Extract dimensions and find max dimensions
      let max_w = 0
      let max_h = 0

      const spritesWithDimensions: SpriteData[] = validSprites.map((sprite) => {
        const { width, height } = extractDimensions(sprite.content)
        max_w = Math.max(max_w, width)
        max_h = Math.max(max_h, height)

        return {
          content: sprite.content,
          width,
          height
        }
      })

      maxWidth.value = max_w
      maxHeight.value = max_h
      spriteSvgs.value = spritesWithDimensions
    }
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.category, props.sprite],
  () => {
    spriteSvgs.value = []
    loading.value = true
    error.value = false
    maxWidth.value = 0
    maxHeight.value = 0
    loadSprites()
  },
  { immediate: true }
)
</script>

<template>
  <div class="item-sprite" :style="{ width: `${size || 48}px`, height: `${size || 48}px` }">
    <ItemSpritePlaceholder v-if="!hasValidData || error || loading" :size="size || 48" />
    <div v-else class="sprite-container" :style="containerStyle">
      <svg
        :width="maxWidth"
        :height="maxHeight"
        :viewBox="`0 0 ${maxWidth} ${maxHeight}`"
        class="sprite-svg"
      >
        <g
          v-for="(sprite, index) in spriteSvgs"
          :key="index"
          v-html="sprite.content.replace(/<\?xml.*?\?>/g, '').replace(/<svg[^>]*>/g, '').replace(/<\/svg>/g, '')"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.item-sprite {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sprite-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sprite-svg {
  width: 100%;
  height: 100%;
}
</style>
